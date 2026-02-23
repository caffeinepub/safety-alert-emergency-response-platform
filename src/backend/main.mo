import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module EmergencyStatus {
    public type Type = { #pending; #accepted; #resolved };

    public func compare(status1 : Type, status2 : Type) : Order.Order {
      switch (status1, status2) {
        case (#pending, #pending) { #equal };
        case (#pending, _) { #less };
        case (#accepted, #pending) { #greater };
        case (#accepted, #accepted) { #equal };
        case (#accepted, #resolved) { #less };
        case (#resolved, #resolved) { #equal };
        case (_, _) { #greater };
      };
    };
  };

  public type Location = {
    latitude : Float;
    longitude : Float;
  };

  public type HelpRequest = {
    id : Nat;
    citizenPrincipal : Principal;
    citizenName : Text;
    citizenMobile : Text;
    location : Location;
    status : EmergencyStatus.Type;
    assignedOfficer : ?Principal;
    timestamp : Int;
  };

  module HelpRequest {
    public func compare(request1 : HelpRequest, request2 : HelpRequest) : Order.Order {
      Int.compare(request1.timestamp, request2.timestamp);
    };

    public func compareByStatus(request1 : HelpRequest, request2 : HelpRequest) : Order.Order {
      switch (EmergencyStatus.compare(request1.status, request2.status)) {
        case (#equal) {
          Int.compare(request1.timestamp, request2.timestamp);
        };
        case (order) { order };
      };
    };
  };

  type ChatMessage = {
    sender : Text;
    message : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
    mobile : Text;
    userType : Text;
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };

    public func compareByMobile(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.mobile, profile2.mobile);
    };
  };

  let helpRequests = Map.empty<Nat, HelpRequest>();
  let chatMessages = Map.empty<Nat, [ChatMessage]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var requestCounter = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Registration - self-selection of role
  public shared ({ caller }) func register(name : Text, mobile : Text, userType : Text) : async () {
    // Check if user already exists
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered");
    };

    // Validate userType
    if (userType != "citizen" and userType != "officer") {
      Runtime.trap("Invalid user type. Must be 'citizen' or 'officer'");
    };

    // Validate inputs
    if (name.size() == 0) {
      Runtime.trap("Name cannot be empty");
    };

    if (mobile.size() == 0) {
      Runtime.trap("Mobile number cannot be empty");
    };

    let profile : UserProfile = {
      name;
      mobile;
      userType;
    };

    userProfiles.add(caller, profile);
  };

  // Citizens send SOS requests
  public shared ({ caller }) func sendSosRequest(location : Location) : async Nat {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (profile.userType != "citizen") {
          Runtime.trap("Only citizens can send SOS requests");
        };

        requestCounter += 1;
        let requestId = requestCounter;

        let request : HelpRequest = {
          id = requestId;
          citizenPrincipal = caller;
          citizenName = profile.name;
          citizenMobile = profile.mobile;
          location;
          status = #pending;
          assignedOfficer = null;
          timestamp = Int.abs(0);
        };

        helpRequests.add(requestId, request);
        chatMessages.add(requestId, []);
        requestId;
      };
    };
  };

  // Officers accept help requests
  public shared ({ caller }) func acceptHelpRequest(requestId : Nat) : async () {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Officer profile not found") };
      case (?profile) {
        if (profile.userType != "officer") {
          Runtime.trap("Only officers can accept requests");
        };

        switch (helpRequests.get(requestId)) {
          case (null) { Runtime.trap("Request not found") };
          case (?request) {
            if (request.status != #pending) {
              Runtime.trap("Request is not pending");
            };

            let updatedRequest : HelpRequest = {
              request with
              status = #accepted;
              assignedOfficer = ?caller;
            };

            helpRequests.add(requestId, updatedRequest);
          };
        };
      };
    };
  };

  // Officers complete help requests
  public shared ({ caller }) func completeHelpRequest(requestId : Nat) : async () {
    switch (helpRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        switch (request.assignedOfficer) {
          case (?officer) {
            if (officer != caller) {
              Runtime.trap("Only the assigned officer can complete this request");
            };
          };
          case (null) { Runtime.trap("Request has not been assigned to any officer") };
        };

        let updatedRequest : HelpRequest = {
          request with status = #resolved
        };

        helpRequests.add(requestId, updatedRequest);
      };
    };
  };

  // Messaging - only participants can send messages
  public shared ({ caller }) func sendMessage(requestId : Nat, sender : Text, message : Text) : async () {
    switch (helpRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        // Check if caller is the citizen or assigned officer
        let isAuthorized = caller == request.citizenPrincipal or (
          switch (request.assignedOfficer) {
            case (?officer) { caller == officer };
            case (null) { false };
          }
        );

        if (not isAuthorized) {
          Runtime.trap("Unauthorized: Only the citizen or assigned officer can send messages");
        };

        let newMessage : ChatMessage = {
          sender;
          message;
          timestamp = Int.abs(0);
        };

        switch (chatMessages.get(requestId)) {
          case (null) {
            chatMessages.add(requestId, [newMessage]);
          };
          case (?messages) {
            let updatedMessages = [newMessage].concat(messages);
            chatMessages.add(requestId, updatedMessages);
          };
        };
      };
    };
  };

  // Get all requests for officers
  public query ({ caller }) func getAllRequests() : async [HelpRequest] {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Officer profile not found") };
      case (?profile) {
        if (profile.userType != "officer") {
          Runtime.trap("Unauthorized: Only officers can view all requests");
        };
      };
    };

    helpRequests.values().toArray();
  };

  // Get requests by status for officers
  public query ({ caller }) func getRequestsByStatus(status : EmergencyStatus.Type) : async [HelpRequest] {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Officer profile not found") };
      case (?profile) {
        if (profile.userType != "officer") {
          Runtime.trap("Unauthorized: Only officers can filter requests");
        };
      };
    };

    helpRequests.values().toArray().filter<HelpRequest>(
      func(request) { request.status == status }
    );
  };

  // Get messages for participants
  public query ({ caller }) func getMessages(requestId : Nat) : async [ChatMessage] {
    switch (helpRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        // Check if caller is the citizen or assigned officer
        let isAuthorized = caller == request.citizenPrincipal or (
          switch (request.assignedOfficer) {
            case (?officer) { caller == officer };
            case (null) { false };
          }
        );

        if (not isAuthorized) {
          Runtime.trap("Unauthorized: Only the citizen or assigned officer can view messages");
        };

        switch (chatMessages.get(requestId)) {
          case (null) { [] };
          case (?messages) { messages };
        };
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(_user : Principal) : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getAllProfiles() : async [UserProfile] {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Officer profile not found") };
      case (?profile) {
        if (profile.userType != "officer") {
          Runtime.trap("Unauthorized: Only officers can view all profiles");
        };
      };
    };
    userProfiles.values().toArray();
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User profile not found. Please register first.");
      };
      case (?existingProfile) {
        // Validate userType hasn't changed (prevent role escalation)
        if (profile.userType != existingProfile.userType) {
          Runtime.trap("Unauthorized: Cannot change user type after registration");
        };

        // Validate inputs
        if (profile.name.size() == 0) {
          Runtime.trap("Name cannot be empty");
        };

        if (profile.mobile.size() == 0) {
          Runtime.trap("Mobile number cannot be empty");
        };

        // Validate userType format
        if (profile.userType != "citizen" and profile.userType != "officer") {
          Runtime.trap("Invalid user type");
        };

        userProfiles.add(caller, profile);
      };
    };
  };
};

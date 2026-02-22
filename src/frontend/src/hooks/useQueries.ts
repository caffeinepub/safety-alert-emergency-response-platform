import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, HelpRequest, ChatMessage, Location, Type } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useRegister() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, mobile, userType }: { name: string; mobile: string; userType: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.register(name, mobile, userType);
      const profile: UserProfile = { name, mobile, userType };
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSendSosRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: Location) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendSosRequest(location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
    },
  });
}

export function useGetAllRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<HelpRequest[]>({
    queryKey: ['helpRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });
}

export function useGetRequestsByStatus(status: Type) {
  const { actor, isFetching } = useActor();

  return useQuery<HelpRequest[]>({
    queryKey: ['helpRequests', status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRequestsByStatus(status);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useAcceptHelpRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.acceptHelpRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpRequests'] });
    },
  });
}

export function useCompleteHelpRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.completeHelpRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpRequests'] });
    },
  });
}

export function useGetMessages(requestId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['messages', requestId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages(requestId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000, // Poll every 3 seconds for real-time chat
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, sender, message }: { requestId: bigint; sender: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.sendMessage(requestId, sender, message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.requestId.toString()] });
    },
  });
}

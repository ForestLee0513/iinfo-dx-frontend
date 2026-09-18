export type FollowListType = "followers" | "following";

export type FollowListProps = {
  identifier: string;
  type: FollowListType;
};

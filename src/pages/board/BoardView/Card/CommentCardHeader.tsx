import React from 'react';
import { MdThumbDown, MdThumbUp } from 'react-icons/md';
import { Avatar, CardHeader } from '@mui/material';
import OutlinedButton from '@components/Button/OutlinedButton';
import { CommentInfo } from '@api/dto';
import { useControlCommentLikesMutation, useControlCommentDislikesMutation } from '@api/commentApi';
import { VscTrash } from 'react-icons/vsc';
import CommentMenu from '../Menu/CommentMenu';

interface CommentCardHeaderProps {
  commentInfo: CommentInfo;
}

const CommentCardHeader = ({ commentInfo }: CommentCardHeaderProps) => {
  const { mutate: controlLikes } = useControlCommentLikesMutation();
  const { mutate: controlDislikes } = useControlCommentDislikesMutation();

  const isReplyComment = Boolean(commentInfo.parentId);

  const handleLikeButtonClick = () => {
    controlLikes(commentInfo.commentId);
  };

  const handleDisikeButtonClick = () => {
    controlDislikes(commentInfo.commentId);
  };

  return commentInfo.content ? (
    <CardHeader
      avatar={<Avatar className="!h-7 !w-7" alt="프로필 이미지" src={commentInfo.writerThumbnailPath ?? undefined} />}
      action={
        <div className="space-x-2">
          <OutlinedButton startIcon={<MdThumbUp />} onClick={handleLikeButtonClick}>
            {commentInfo.likeCount}
          </OutlinedButton>
          <OutlinedButton startIcon={<MdThumbDown />} onClick={handleDisikeButtonClick}>
            {commentInfo.dislikeCount}
          </OutlinedButton>
          <CommentMenu commentId={commentInfo.commentId} />
        </div>
      }
      title={commentInfo.writerName}
      subheader={undefined /* TODO 경과 시간 */}
    />
  ) : (
    <CardHeader
      className="text-subGray"
      avatar={<VscTrash size={30} className="fill-subGray" />}
      title={isReplyComment ? '삭제된 대댓글입니다.' : '삭제된 댓글입니다.'}
    />
  );
};

export default CommentCardHeader;

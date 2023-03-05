import React, { useState, useReducer } from 'react';
import OutlinedButton from '@components/Button/OutlinedButton';
import ActionModal from '@components/Modal/ActionModal';

const DeleteBookButton = () => {
  const [open, toggleOpen] = useReducer((prev) => !prev, false);
  return (
    <div className="flex">
      <OutlinedButton onClick={() => toggleOpen()}>도서 삭제</OutlinedButton>

      <ActionModal
        opened={open}
        handleOpen={toggleOpen}
        title="도서삭제"
        buttonName="삭제"
        onActionButonClick={() => {
          toggleOpen();
        }}
      >
        N권의 도서를 삭제하시겠습니까?
      </ActionModal>
    </div>
  );
};

export default DeleteBookButton;

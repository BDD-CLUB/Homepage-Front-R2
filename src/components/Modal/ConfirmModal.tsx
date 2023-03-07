import React from 'react';

import { Dialog, DialogHeader, DialogBody, DialogFooter, Typography } from '@material-tailwind/react';
import FilledButton from '@components/Button/FilledButton';
import { VscChromeClose } from 'react-icons/vsc';

interface ConfirmModalProps {
  opened: boolean;
  onHandleOpen: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmModal = ({ opened, onHandleOpen, title, children }: ConfirmModalProps) => {
  return (
    <Dialog open={opened} handler={onHandleOpen} className="rounded-lg bg-subBlack py-5 px-10">
      <VscChromeClose className="absolute right-5" size="19" color="#4CEEF9" onClick={onHandleOpen} />
      <DialogHeader className="break-all font-bold text-pointBlue">
        <Typography variant="h3">{title}</Typography>
      </DialogHeader>
      <DialogBody className="min-h-[80px] break-all pt-0 text-white">{children}</DialogBody>
    </Dialog>
  );
};

export default ConfirmModal;

import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { MeritTypeInfo } from '@api/dto';
import { useGetMemberInfoQuery } from '@api/dutyManageApi';
import { useAddMeritLogMutation } from '@api/meritApi';
import AutoComplete, { AutoCompleteValueType } from '@components/Input/AutoComplete';
import ActionModal from '@components/Modal/ActionModal';
import Selector from '@components/Selector/Selector';

interface AddMeritModalProps {
  open: boolean;
  onClose: () => void;
  meritTypes: MeritTypeInfo[];
}

type MeritInfo = {
  awarders: AutoCompleteValueType;
  meritTypeId: number;
};

const AddMeritModal = ({ open, onClose, meritTypes }: AddMeritModalProps) => {
  const [meritInfo, setMeritInfo] = useState<MeritInfo>({
    awarders: [],
    meritTypeId: 0,
  });

  const { data: members } = useGetMemberInfoQuery();
  const { mutate: addMeritMutation } = useAddMeritLogMutation();

  const reset = () => {
    setMeritInfo({
      awarders: [],
      meritTypeId: 0,
    });
  };

  const validate = () => {
    return (meritInfo.awarders as Array<unknown>).length > 0 && meritInfo.meritTypeId !== 0;
  };

  const handleAddMeritButtonClick = () => {
    const isValid = validate();
    if (isValid) {
      onClose();
      reset();
    }
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="상벌점 부여"
      modalWidth="xs"
      actionButtonName="추가"
      onActionButonClick={handleAddMeritButtonClick}
    >
      <div className="flex space-x-6">
        <div className="relative grow space-y-5">
          <div>
            <Typography>회원</Typography>
            <AutoComplete
              className="w-full"
              value={meritInfo.awarders}
              multiple
              onChange={(v) => {
                setMeritInfo((prev) => ({ ...prev, awarders: v }));
              }}
              items={members?.map((member) => ({
                value: member.memberId,
                label: `${member.memberName} (${member.generation})`,
                group: member.generation,
              }))}
            />
          </div>
          <div>
            <Typography>사유</Typography>
            <Selector
              className="w-full"
              value={meritInfo.meritTypeId}
              onChange={(e) => {
                setMeritInfo((prev) => ({ ...prev, meritTypeId: e.target.value as number }));
              }}
              options={meritTypes.map((type) => ({
                id: type.id,
                content: type.detail,
              }))}
            />
          </div>
        </div>
      </div>
    </ActionModal>
  );
};

export default AddMeritModal;

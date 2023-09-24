import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputLabel, Stack, Typography } from '@mui/material';
import { SiNotion } from 'react-icons/si';
import { VscGithubInverted, VscLink } from 'react-icons/vsc';

import { useRecoilValue } from 'recoil';
import { useGetMemberInfoQuery } from '@api/dutyManageApi';
import { useAddStudyMutation } from '@api/studyApi';
import { REQUIRE_ERROR_MSG } from '@constants/errorMsg';
import memberState from '@recoil/member.recoil';
import AutoComplete, { MultiAutoCompleteValue, SingleAutoCompleteValue } from '@components/Input/AutoComplete';
import StandardInput from '@components/Input/StandardInput';
import ActionModal from '@components/Modal/ActionModal';
import ImageUploader from '@components/Uploader/ImageUploader';
import { ModalInfo } from '../Study.interface';

const STUDY_TITLE_MAX_LENGTH = 45;
const STUDY_CONTENT_MAX_LENGTH = 100;

interface StudyModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalInfo: ModalInfo;
}

const StudyModal = ({ open, setOpen, modalInfo }: StudyModalProps) => {
  const userInfo = useRecoilValue(memberState);
  const [thumbnail, setThumbnail] = useState<Blob | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mode, selectedStudy } = modalInfo;
  const { control, getValues } = useForm({ mode: 'onBlur' });
  const { mutate: addStudy } = useAddStudyMutation();

  const { data: members } = useGetMemberInfoQuery();

  const [leaderId, setLeaderId] = useState<SingleAutoCompleteValue>(null);
  const [memberIds, setMemberIds] = useState<MultiAutoCompleteValue>([]);

  const handleAddActionButtonClick = () => {
    addStudy(
      {
        request: {
          title: getValues('studyTitle'),
          information: getValues('studyInformation'),
          gitLink: getValues('gitLink'),
          notionLink: getValues('notionLink'),
          etcTitle: getValues('etcTitle'),
          etcLink: getValues('etcLink'),
          year: 2023 /* TODO 년도 학기 정보 props로 받아오기 */,
          season: 1,
          memberIds: memberIds?.map((v) => ({ id: v.value as number })),
        },
        thumbnail,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  useEffect(() => {
    if (open && userInfo) {
      setLeaderId({
        value: userInfo.memberId,
        label: `${userInfo.realName} (${userInfo.generation})`,
      });
      setMemberIds([
        {
          value: userInfo.memberId,
          label: `${userInfo.realName} (${userInfo.generation})`,
          group: userInfo.generation,
          fixed: true,
        },
      ]);
    }
  }, [open, userInfo]);

  return (
    <ActionModal
      open={open}
      onClose={() => setOpen(false)}
      title={mode === 'Edit' ? '스터디 수정' : '스터디 추가'}
      actionButtonName={mode === 'Edit' ? '수정' : '추가'}
      onActionButonClick={handleAddActionButtonClick}
    >
      <div className="mb-10 flex justify-between">
        <Stack flexGrow={1} marginRight={3} spacing={3}>
          <div>
            <InputLabel className="!font-semibold">스터디명</InputLabel>
            <Controller
              name="studyTitle"
              defaultValue=""
              control={control}
              rules={{
                required: REQUIRE_ERROR_MSG,
                maxLength: {
                  value: STUDY_TITLE_MAX_LENGTH,
                  message: `최대 ${STUDY_TITLE_MAX_LENGTH}글자 입력이 가능합니다.`,
                },
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <StandardInput
                    className="w-64"
                    {...field}
                    error={Boolean(error)}
                    helperText={error?.message}
                    autoFocus
                  />
                );
              }}
            />
          </div>
          <div>
            <InputLabel className="!font-semibold">스터디 소개</InputLabel>
            <Controller
              name="studyInformation"
              defaultValue=""
              control={control}
              rules={{
                required: REQUIRE_ERROR_MSG,
                maxLength: {
                  value: STUDY_CONTENT_MAX_LENGTH,
                  message: `최대 ${STUDY_CONTENT_MAX_LENGTH}글자 입력이 가능합니다.`,
                },
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <StandardInput
                    className="w-full"
                    multiline
                    rows={2}
                    {...field}
                    error={Boolean(error)}
                    helperText={error?.message}
                    autoFocus
                  />
                );
              }}
            />
          </div>
        </Stack>
        <div className="h-40 w-32">
          <ImageUploader isEdit={false} setThumbnail={setThumbnail} />
        </div>
      </div>
      <div className="mb-10 flex space-x-2">
        <div className="w-[280px] space-y-2">
          <InputLabel className="!font-semibold">스터디장</InputLabel>
          <AutoComplete
            className="flex space-x-2 pb-[6px]"
            value={leaderId}
            items={members?.map((member) => ({
              value: member.memberId,
              label: `${member.realName} (${member.generation})`,
              group: member.generation,
            }))}
            onChange={(v) => {
              setLeaderId(v);
              if (v) {
                setMemberIds([{ ...v, fixed: true }]);
              }
            }}
          />
        </div>
        <div className="w-full space-y-2">
          <InputLabel className="!font-semibold">스터디원</InputLabel>
          <AutoComplete
            className="flex space-x-2 pb-[6px]"
            multiple
            grouped
            value={memberIds}
            items={members?.map((member) => ({
              value: member.memberId,
              label: `${member.realName} (${member.generation})`,
              group: member.generation,
              fixed: member.memberId === leaderId?.value,
            }))}
            onChange={setMemberIds}
          />
        </div>
      </div>
      <div className="space-y-4">
        <InputLabel className="!font-semibold">
          <span className="mr-1">링크</span>
          <span className="text-small text-subGray">(1개 이상 링크 필수)</span>
        </InputLabel>
        <Stack spacing={2}>
          <div className="flex items-center space-x-2">
            <VscGithubInverted size={25} className="fill-pointBlue" />
            <Typography className="w-24 text-center">Github</Typography>
            <Controller
              name="githubLink"
              defaultValue=""
              control={control}
              rules={{
                pattern: {
                  value: /^(https:\/\/github.com)/,
                  message: `깃헙 링크만 입력이 가능합니다.`,
                },
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <StandardInput
                    className="w-full"
                    placeholder="https://"
                    {...field}
                    error={Boolean(error)}
                    helperText={error?.message}
                    autoFocus
                  />
                );
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <SiNotion size={25} className="fill-pointBlue" />
            <Typography className="w-24 text-center">Notion</Typography>
            <Controller
              name="notionLink"
              defaultValue=""
              control={control}
              rules={{
                pattern: {
                  value: /^(https:\/\/)/,
                  message: `https:// 로 시작해야 합니다.`,
                },
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <StandardInput
                    className="w-full"
                    placeholder="https://"
                    {...field}
                    error={Boolean(error)}
                    helperText={error?.message}
                    autoFocus
                  />
                );
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <VscLink size={25} className="fill-pointBlue" />
            <Controller
              name="etcTitle"
              defaultValue=""
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <StandardInput
                    className="w-24"
                    placeholder="ex. Plato"
                    {...field}
                    error={Boolean(error)}
                    helperText={error?.message}
                    autoFocus
                  />
                );
              }}
            />
            <Controller
              name="etcLink"
              defaultValue=""
              control={control}
              rules={{
                pattern: {
                  value: /^(https:\/\/)/,
                  message: `https:// 로 시작해야 합니다.`,
                },
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <StandardInput
                    className="w-full"
                    placeholder="https://"
                    {...field}
                    error={Boolean(error)}
                    helperText={error?.message}
                    autoFocus
                  />
                );
              }}
            />
          </div>
        </Stack>
      </div>
    </ActionModal>
  );
};

export default StudyModal;

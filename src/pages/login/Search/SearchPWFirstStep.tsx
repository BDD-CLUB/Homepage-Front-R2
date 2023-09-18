import React, { useState } from 'react';
import { Divider } from '@mui/material';
import { DateTime } from 'luxon';
import { useCheckAuthCodeQuery, useRequestAuthCodeMutation } from '@api/SearchAccountApi';
import { validateEmail } from '@utils/validateEmail';
import OutlinedButton from '@components/Button/OutlinedButton';
import EmailAuthInput from '@components/Input/EmailAuthInput';
import StandardInput from '@components/Input/StandardInput';
import TimerInput from '@components/Input/TimerInput';
import MailAuthenticationModal from '@components/Modal/MailAuthenticationModal';
import WarningModal from '@components/Modal/WarningModal';

const TIMER_DURATION_SECOND = 300;
interface searchPWFormProps {
  id: string;
  email: string;
  verificationCode: string;
}

interface SearchPWFirstStepProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  form: searchPWFormProps;
  setForm: React.Dispatch<React.SetStateAction<searchPWFormProps>>;
}

const SearchPWFirstStep = ({ setCurrentStep, form, setForm }: SearchPWFirstStepProps) => {
  const { mutate: requestAuthcode } = useRequestAuthCodeMutation();
  const { data: checkAuthcodeData } = useCheckAuthCodeQuery({
    loginId: form.id,
    email: form.email,
    authCode: form.verificationCode,
  });

  const [isSent, setIsSent] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [mailAuthenticationModalOpen, setMailAuthenticationModalOpen] = useState(false);
  const [matchInfoModalOpen, setMatchInfoModalOpen] = useState(false);
  const [isValidAuthCode, setIsValidAuthCode] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm({
      ...form,
      [name]: value,
    });
    if (name === 'email') {
      const isValid = validateEmail(value);
      setIsValidEmail(isValid);
    }
  };

  const handleRequestVerificationCode = () => {
    if (form.id && form.email) {
      requestAuthcode(
        { loginId: form.id, email: form.email },
        {
          onSuccess: () => {
            setIsSent(true);
            setMatchInfoModalOpen(false);
          },
          onError: () => {
            setMatchInfoModalOpen(true);
          },
        },
      );
    }
  };

  const handleConfirmFirstStep = () => {
    if (checkAuthcodeData?.auth === true) {
      setCurrentStep(2);
    } else {
      setIsValidAuthCode(false);
    }
  };

  const handleOtherEmailButtonClick = () => {
    setIsSent(false);
    setForm({ ...form, email: '', verificationCode: '' });
    setMailAuthenticationModalOpen(false);
  };

  const handleResendMailButtonClick = () => {
    requestAuthcode({ loginId: form.id, email: form.email });
    setMailAuthenticationModalOpen(false);
  };

  return (
    <>
      <div className="pb-8 pt-10 text-center">
        <p>가입 시 등록한 이메일을 입력해주세요.</p>
        <p>비밀번호 재설정을 위한 인증코드가 이메일로 발송됩니다.</p>
      </div>
      <Divider className="bg-pointBlue" />
      <div className="mx-20 my-12 flex flex-col justify-center gap-10">
        <div className="relative flex justify-between gap-10">
          <p className="mt-4 leading-4">아이디</p>
          <StandardInput hasBackground className="w-[70%]" required name="id" value={form.id} onChange={handleChange} />
        </div>
        <div className="relative flex justify-between gap-10">
          <p className="mt-4 leading-4">이메일</p>
          <EmailAuthInput
            className="w-[70%]"
            inputDisabled={isSent}
            value={form.email}
            onChange={handleChange}
            buttonDisabled={!isValidEmail || isSent}
            onAuthButtonClick={handleRequestVerificationCode}
          />
        </div>
        <WarningModal
          open={matchInfoModalOpen}
          onClose={() => setMatchInfoModalOpen(false)}
          actionButtonName="확인"
          onActionButonClick={() => setMatchInfoModalOpen(false)}
        >
          해당 아이디 + 이메일로 가입된 정보가 없습니다.
        </WarningModal>
        <div className="flex justify-between gap-10">
          <p className="mt-4 leading-4">인증코드</p>
          <TimerInput
            className="w-[70%]"
            name="verificationCode"
            value={form.verificationCode}
            onChange={handleChange}
            disabled={!isSent}
            expirationTime={DateTime.now().plus({ seconds: TIMER_DURATION_SECOND })}
          />
        </div>
        <div className="responsive flex w-full justify-between">
          {!isValidAuthCode && (
            <p className="absolute left-20 text-red-500">인증코드가 맞지 않습니다. 다시 입력해주세요.</p>
          )}
          <button
            type="button"
            className="absolute right-20 cursor-pointer hover:underline hover:duration-300"
            onClick={() => setMailAuthenticationModalOpen(true)}
          >
            인증 메일이 오지 않았나요?
          </button>
          <MailAuthenticationModal
            open={mailAuthenticationModalOpen}
            onClose={() => setMailAuthenticationModalOpen(false)}
            onOtherEmailButtonClick={handleOtherEmailButtonClick}
            onResendMailButtonClick={handleResendMailButtonClick}
          />
        </div>
      </div>
      <Divider className="bg-pointBlue" />
      <div className="mt-10 text-center">
        <OutlinedButton disabled={!(form.verificationCode.length > 0)} onClick={handleConfirmFirstStep}>
          확인
        </OutlinedButton>
      </div>
    </>
  );
};

export default SearchPWFirstStep;

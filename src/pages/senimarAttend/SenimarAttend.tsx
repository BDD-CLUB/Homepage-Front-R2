import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import OutlinedButton from '@components/Button/OutlinedButton';
import FilledButton from '@components/Button/FilledButton';
import PageTitle from '@components/Typography/PageTitle';
import { Typography } from '@mui/material';
import SeminarCard from './Card/SeminarCard';
import BossCardContent from './Card/BossCardContent';
import MemberCardContent from './Card/MemberCardContent';

const SeminarAttend = () => {
  const seminarDate = DateTime.now(); // 이후 삭제
  const seminarActivated = true; // TODO: useState, api 적용
  // 최근(중앙 배치) 세미나: recentSeminar
  // 예정(왼쪽 배치) 세미나: futureSeminar
  // 이전(오른쪽 배치) 세미나: pastSeminar
  const [recentSeminarDate, setRecentSeminarDate] = useState('today'); // TODO: api 적용
  const [futureSeminarDate, setFutureSeminarDate] = useState('towmorrow');
  const [pastSeminarDate, setPastSeminarDate] = useState('yesterday');
  const [isBoss, setIsBoss] = useState(true); // TODO: api 적용

  useEffect(() => {
    setRecentSeminarDate(DateTime.now().toFormat('yy.MM.dd'));
    setFutureSeminarDate(seminarDate.minus({ days: 1 }).toFormat('yy.MM.dd'));
    setPastSeminarDate(seminarDate.plus({ days: 1 }).toFormat('yy.MM.dd'));
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <PageTitle>세미나 출석</PageTitle>
        <OutlinedButton>세미나 관리</OutlinedButton>
      </div>
      <div className="mt-[180px] flex justify-center">
        <SeminarCard>
          {seminarActivated ? (
            <>
              <Typography className="text-center text-paragraph text-white">{pastSeminarDate} 세미나</Typography>
              {isBoss ? <BossCardContent /> : <MemberCardContent />}
            </>
          ) : (
            <Typography className="text-center text-h3 font-bold">예정된 세미나가 없습니다.</Typography>
          )}
        </SeminarCard>
        <SeminarCard>
          {seminarActivated ? (
            <>
              <Typography className="text-center text-paragraph text-white">{recentSeminarDate} 세미나</Typography>
              {isBoss ? <BossCardContent /> : <MemberCardContent />}
            </>
          ) : (
            <Typography className="text-center text-h3 font-bold">예정된 세미나가 없습니다.</Typography>
          )}
        </SeminarCard>
        <SeminarCard>
          {seminarActivated ? (
            <>
              <Typography className="text-center text-paragraph text-white">{futureSeminarDate} 세미나</Typography>
              {isBoss ? <BossCardContent /> : <MemberCardContent />}
            </>
          ) : (
            <Typography className="text-center text-h3 font-bold">예정된 세미나가 없습니다.</Typography>
          )}
        </SeminarCard>
        {isBoss ? (
          <FilledButton onClick={() => setIsBoss(false)}>회원권한페이지로</FilledButton>
        ) : (
          <FilledButton onClick={() => setIsBoss(true)}>회장권한페이지로</FilledButton>
        )}
      </div>
    </>
  );
};

export default SeminarAttend;

import React, { useState } from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary } from '@mui/material';
import { VscChevronDown } from 'react-icons/vsc';

import useCheckAuth from '@hooks/useCheckAuth';
import ActionButton from '@components/Button/ActionButton';
import StudyAccordionBody from './StudyAccordionBody';
import StudyAccordionHeader from './StudyAccordionHeader';
import StudyModal from '../Modal/StudyModal';
import type { PeriodicInfo, StudyInfo } from '@api/dto';

interface StudyAccordionProps {
  study: StudyInfo;
  currentPeriod: PeriodicInfo;
}

const StudyAccordion = ({ study, currentPeriod }: StudyAccordionProps) => {
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const { checkIsMyId } = useCheckAuth();

  const handleStudyEditButtonClick = () => {
    setStudyModalOpen(true);
  };

  const handleStudyDeleteButtonClick = () => {
    // TODO 스터디 제거 API 호출 후 새로고침(기능 구현 후 console 삭제 예정)
  };

  return (
    <Accordion className="!shadow-none">
      <AccordionSummary
        className="!h-20 !border-b !border-white/[20%] !bg-subBlack !px-4 !text-white hover:!bg-subGray hover:!text-white focus:!outline-0"
        expandIcon={<VscChevronDown />}
      >
        <StudyAccordionHeader study={study} />
      </AccordionSummary>
      <AccordionDetails className="!space-y-[30px] !bg-middleBlack !px-[41px] !py-[30px] !text-white">
        <StudyAccordionBody studyId={study.studyId} />
      </AccordionDetails>
      {checkIsMyId(study.headId) && (
        <AccordionActions className="border-t border-subBlack !bg-middleBlack">
          <ActionButton mode="edit" small onClick={handleStudyEditButtonClick}>
            수정
          </ActionButton>
          <ActionButton mode="delete" small onClick={handleStudyDeleteButtonClick}>
            삭제
          </ActionButton>
          {studyModalOpen && (
            <StudyModal
              open={studyModalOpen}
              setOpen={setStudyModalOpen}
              selectedStudyInfo={study}
              currentPeriod={currentPeriod}
            />
          )}
        </AccordionActions>
      )}
    </Accordion>
  );
};

export default StudyAccordion;

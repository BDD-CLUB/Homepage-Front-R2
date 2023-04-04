import React, { Dispatch, DispatchWithoutAction, SetStateAction, useReducer } from 'react';
import {
  ThemeProvider,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  AccordionStylesType,
} from '@material-tailwind/react';
import { VscChevronDown, VscChevronUp, VscGithubInverted, VscLink } from 'react-icons/vsc';
import { SiNotion } from 'react-icons/si';

import { Divider } from '@mui/material';
import type { StudyListInfo } from '@api/dto';
import OutlinedButton from '@components/Button/OutlinedButton';
import { Link } from 'react-router-dom';
import { StudyChip } from '../share/StudyChip';

// TODO MUI 라이브러리로 변경

interface StudyAccordionProps {
  study: StudyListInfo;
  memberId: number;
  toggleOpen: DispatchWithoutAction;
  setSelectedStudy: Dispatch<SetStateAction<StudyListInfo>>;
}

type StudyAccordionHeaderProps = Pick<StudyAccordionProps, 'study'>;

const theme = {
  accordion: {
    styles: {
      base: {
        container: {},
        header: {
          initial: {
            fontColor: 'text-white',
            borderColor: 'border-white/[20%]',
            focus: 'focus:outline-0',
            hover: 'hover:text-white hover:bg-subGray',
            padding: 'px-4',
          },
          active: {
            fontColor: 'text-white',
          },
        },
        body: {
          bgColor: 'bg-middleBlack',
          fontColor: 'text-white',
        },
      },
    },
  } satisfies AccordionStylesType,
};

const StudyAccordionHeader = ({ study }: StudyAccordionHeaderProps) => {
  return (
    <div className="flex w-full space-x-2 pl-2 text-left">
      <span className="max-w-16 max-h-16 bg-gray-300">이미지</span>
      <div className="flex w-full items-center justify-between">
        <Typography className="text-h3 font-bold">{study.title}</Typography>
        <div className="flex items-center">
          <Typography className="mr-1 font-semibold">스터디장</Typography>
          <StudyChip value={study.headMember.realName} />
          <Divider className="!m-1 !border-white" orientation="vertical" flexItem />
          <Typography className="font-semibold">현재 인원 {study.memberNumber}명</Typography>
        </div>
      </div>
    </div>
  );
};

const StudyAccordionBody = ({ study, memberId, toggleOpen, setSelectedStudy }: StudyAccordionProps) => {
  interface IconType {
    [key: string]: React.ReactNode;
  }

  const { information, headMember, memberList } = study;

  const LinkIconData: IconType = {
    github: <VscGithubInverted className="h-7 w-7" />,
    notion: <SiNotion className="h-7 w-7" />,
    etc: <VscLink className="h-7 w-7" />,
  };

  const handleStudyModifyButtonClick = () => {
    toggleOpen();
    setSelectedStudy(study);
  };
  const handleStudyDeleteButtonClick = () => {
    // TODO 기능 구현 후 삭제 예정
    console.log(`${study.title}삭제`);
  };

  return (
    <div className="space-y-[30px]">
      <div className="flex justify-between">
        <div className="space-y-4">
          <Typography className="font-semibold">스터디 소개</Typography>
          <Typography className="border-l-2 border-pointBlue px-2">{information}</Typography>
        </div>
        {memberId === headMember.id && (
          <div className="space-x-2">
            <OutlinedButton onClick={handleStudyModifyButtonClick}>수정</OutlinedButton>
            <OutlinedButton onClick={handleStudyDeleteButtonClick}>삭제</OutlinedButton>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <Typography className="font-semibold">스터디원</Typography>
        <div className="flex space-x-2">
          {memberList?.map(({ id, realName }) => (
            <StudyChip key={id} value={realName} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Typography className="font-semibold">링크</Typography>
        <div className="flex space-x-2 text-pointBlue">
          {study.link?.map(({ title, contents }) => (
            <Link to={contents} target="_blank" key={title} className="flex items-center space-x-2">
              <span>{LinkIconData[title] ? LinkIconData[title] : LinkIconData.etc}</span>
              <span className="border-b border-pointBlue">{title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const StudyAccordion = ({ study, memberId, toggleOpen, setSelectedStudy }: StudyAccordionProps) => {
  const [open, setOpen] = useReducer((prev) => !prev, false);

  return (
    <ThemeProvider value={theme}>
      <Accordion open={open} icon={open ? <VscChevronUp /> : <VscChevronDown />}>
        <AccordionHeader className="h-20" onClick={setOpen}>
          <StudyAccordionHeader study={study} />
        </AccordionHeader>
        <AccordionBody className="space-y-[30px] py-[30px] px-[41px]">
          <StudyAccordionBody
            study={study}
            memberId={memberId}
            toggleOpen={toggleOpen}
            setSelectedStudy={setSelectedStudy}
          />
        </AccordionBody>
      </Accordion>
    </ThemeProvider>
  );
};

export default StudyAccordion;

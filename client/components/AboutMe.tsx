import styled from 'styled-components';
import { ReactTyped } from 'react-typed';
import Image from 'next/image';

import profileImage from '@public/images/profile.jpg';

export default function AboutMe() {
  return (
    <WrapperSt>
      <AnimationTextSt
        strings={['코드와 고민을 쌓으며 성장하는 개발자']}
        typeSpeed={100}
        backSpeed={50}
        loop={true}
      />
      <InfoWrapSt>
        <ProfileImageSt src={profileImage} alt="profile image" priority />
        <InfoTextWrapSt>
          <p className="normalText">
            <span className="smallTitle">
              안녕하세요. 4년차 웹 개발자 김동환입니다.
            </span>
            <br />
            <br />
            스타트업의 개발팀 초기 멤버로 합류하여 서비스 기획부터 클라이언트
            대상 베타 테스트 및 사업화까지 진행하며 주로 프론트엔드 개발을
            담당했고 필요에 따라 백엔드 업무까지 겸해 다양한 업무 경험이
            있습니다.
            <br />
            <br />
            문제의 답만을 찾는것이 아닌 왜 그런답이 나왔는지 더 좋은 방법은
            없는지 고민하고 이를 통해 성장합니다. 이 과정을 통해 사람들이
            일상에서 필요로 하고 행복을 줄 수 있는 서비스를 만드는 개발자가
            되는것을 목표로 합니다.
          </p>
          <h2 className="subTitle">Contact</h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <span className="normalText">
              <em style={{ marginRight: '10px' }}>✉️</em>hwan970104@gmail.com
            </span>
            <span className="normalText">
              <em style={{ marginRight: '10px' }}>📞</em>010-8737-9411
            </span>
          </div>

          <h2 className="subTitle">Skill</h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <span className="normalText">
              <em style={{ marginRight: '10px', fontWeight: 700 }}>
                FrontEnd:
              </em>
              JavaScript, TypeScript, React.js, Next.js, HTML/CSS
            </span>
            <span className="normalText">
              <em style={{ marginRight: '10px', fontWeight: 700 }}>BackEnd:</em>
              NodeJS, PHP
            </span>
            <span className="normalText">
              <em style={{ marginRight: '10px', fontWeight: 700 }}>DB:</em>MYSQL
            </span>
          </div>

          <a
            href="https://cherry-tabletop-064.notion.site/16c3414befcf802bb87ef933bebe8abf?pvs=4"
            target="_blank"
            rel="noreferrer noopener"
            style={{ textAlign: 'right', fontWeight: 700 }}
          >
            more +
          </a>
        </InfoTextWrapSt>
      </InfoWrapSt>
    </WrapperSt>
  );
}

// export const getServerSideProps = ssrRequireAuthentication();

const WrapperSt = styled.article`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const AnimationTextSt = styled(ReactTyped)`
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 700;

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    font-size: 20px;
  }
`;
const ProfileImageSt = styled(Image)`
  width: 300px;
  max-width: 40%;
  height: auto;
`;
const InfoWrapSt = styled.div`
  display: flex;
  gap: 14px;
  align-items: start;

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    flex-direction: column;
    align-items: center;

    & img {
      max-width: 60%;
    }
  }
`;
const InfoTextWrapSt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1.5;

  p {
    line-height: 1.5;
  }

  h2 {
    color: var(--primary-color);
  }
`;

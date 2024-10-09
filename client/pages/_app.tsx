import { AppProps } from 'next/app';
import Head from 'next/head';
import { styled } from 'styled-components';
import localFont from 'next/font/local';
import { usePathname } from 'next/navigation';

import '@/styles/globals.css';

import Nav from '@/components/Nav';
import Header from '@/components/Header';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  console.log('----- App Rendering -----');
  const pathName = usePathname();

  pageProps.pathName = pathName;

  return (
    <>
      <Head>
        <title>Gabdong</title>
      </Head>
      <WrapperSt id="wrapper" className={pretendard.variable}>
        <Header pathName={pathName} />
        <MainSt>
          <Nav />
          <ComponentWrapSt className="scroll" id="contentWrap">
            <ComponentContainerSt id="contentContainer">
              <Component {...pageProps} />
            </ComponentContainerSt>
          </ComponentWrapSt>
        </MainSt>
      </WrapperSt>
    </>
  );
}

const WrapperSt = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  font-family: var(--font-pretendard);
  user-select: none;
`;
const MainSt = styled.main`
  display: flex;
  flex: 1;
  max-height: calc(100% - var(--header-height));
`;
const ComponentWrapSt = styled.div`
  flex: 1;

  margin: 0 auto;
  overflow-y: auto;
`;
const ComponentContainerSt = styled.div`
  width: 1400px;
  max-width: 90%;
  margin: 0 auto;
  padding-top: 20px;
  background: purple;
`;

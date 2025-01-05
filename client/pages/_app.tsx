import { AppProps } from 'next/app';
import Head from 'next/head';
import styled from 'styled-components';
import localFont from 'next/font/local';
import { Provider } from 'react-redux';

import '@styles/globals.css';
import '@styles/markdown-editor.css';
import '@styles/markdown.css';

import wrapper from '@redux/store';

import Nav from '@components/Nav';
import Header from '@components/header/Header';
import ModalContainer from '@components/ModalContainer';
import { makeClassName } from '@utils/utils';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

function App({ Component, ...rest }: AppProps): JSX.Element {
  console.log('----- App Rendering -----');
  const {
    store,
    props: { pageProps },
  } = wrapper.useWrappedStore(rest);

  const errorPages = ['/401', '/404', '/500', '/_error'];
  const pathname = rest.router.route;
  const isNoHeader = errorPages.includes(pathname);
  const isNoNav = errorPages.includes(pathname);
  const noHeaderClass = isNoHeader ? 'isNoHeader' : '';

  return (
    <Provider store={store}>
      <Head>
        <title>Gabdong</title>
      </Head>
      <WrapperSt
        id="wrapper"
        className={makeClassName([pretendard.variable, noHeaderClass])}
      >
        {!isNoHeader && <Header {...pageProps} />}
        <MainSt>
          {!isNoNav && <Nav {...pageProps} />}
          <ComponentWrapSt className="scroll" id="contentWrap">
            <ComponentContainerSt id="contentContainer">
              <Component {...pageProps} />
            </ComponentContainerSt>
          </ComponentWrapSt>
        </MainSt>
        <aside id="modal">
          <ModalContainer {...pageProps} />
        </aside>
      </WrapperSt>
    </Provider>
  );
}

const WrapperSt = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  font-family: var(--font-pretendard);
  user-select: none;

  &:not(.isNoHeader) main {
    max-height: calc(100% - var(--header-height));
  }
`;
const MainSt = styled.main`
  display: flex;
  flex: 1;
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
  padding: 20px 0;
`;

export default App;

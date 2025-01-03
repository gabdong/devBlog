import LinkButton from '@components/LinkButton';

export default function Custom404() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        width: '100%',
        height: '100%',
        position: 'fixed',
        left: '0',
        top: '0',
      }}
    >
      <span>404 Not Found</span>
      <span>존재하지 않는 페이지입니다.</span>
      <LinkButton href="/" text="메인으로" />
    </div>
  );
}

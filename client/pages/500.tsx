import LinkButton from '@components/LinkButton';

export default function Custom500() {
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
      <span>500 Internal Server Error</span>
      <span>관리자에게 문의해주세요.</span>
      <LinkButton href="/" text="메인으로" />
    </div>
  );
}

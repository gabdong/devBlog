import LinkButton from '@components/LinkButton';

export default function Custom401() {
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
      <span>401 Unauthorized</span>
      <span>접근권한이 없습니다.</span>
      <LinkButton href="/" text="메인으로" />
    </div>
  );
}

// import { setName } from '@redux/slices/user';
// import wrapper from '@redux/store';
// import { InferGetServerSidePropsType } from 'next';

// export default function AboutMe({}: InferGetServerSidePropsType<
//   typeof getServerSideProps
// >): JSX.Element {
export default function AboutMe(): JSX.Element {
  return <div>about_me</div>;
}

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async () => {
//     store.dispatch(setName('2222233'));
//     return {
//       props: {},
//     };
//   },
// );

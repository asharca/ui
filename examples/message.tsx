import { Message } from '@/components/asharca/message';
export default function MessageDemo() {
  const answer = '当然。从一个组件开始，保留需要的内容，让其余部分更安静。';
  return <div className="grid w-full max-w-md gap-5"><Message role="user">帮我做一个简约的界面。</Message><Message role="assistant" copyText={answer}>{answer}</Message></div>;
}

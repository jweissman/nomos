type Topic = 'nemea'
type Question = { question: string, answer: string[] }
type DialogTopic = { topic: Topic, questions: Question[] }
type Dialogue = { interlocutor: string, topics: DialogTopic[] }

const q = (question: string, answer: string[]): Question => { return {
    question,
    answer,
}}
const topic = (name: Topic, questions: Question[]): DialogTopic => { return {
    topic: name,
    questions,
}}
const conversation = (name: string, topics: DialogTopic[]): Dialogue => { return {
    interlocutor: name,
    topics,
}}

export default Dialogue;
export { q, topic, conversation }
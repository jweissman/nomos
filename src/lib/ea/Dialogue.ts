type Topic = 'nemea'
type Question = { question: string, answer: string[] }
type DialogTopic = { topic: Topic, questions: Question[] }
type Dialog = { interlocutor: string, topics: DialogTopic[] }

const q = (question: string, answer: string[]): Question => { return {
    question,
    answer,
}}
const topic = (name: Topic, questions: Question[]): DialogTopic => { return {
    topic: name,
    questions,
}}
const conversation = (name: string, topics: DialogTopic[]): Dialog => { return {
    interlocutor: name,
    topics,
}}
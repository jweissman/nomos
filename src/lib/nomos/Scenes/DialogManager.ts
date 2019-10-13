import Dialogue, { DialogTopic, Question } from "../../ea/Dialogue";
import mod from "../../util/mod";
export type DialogActivity = 'picking-topic' | 'picking-question' | 'answering-question'
export class DialogManager {
    public state: {
        activity: DialogActivity;
        topic?: DialogTopic;
        question?: Question;
        hoveredIndex: number;
        answerStep: number;
        // complete?:
    } = {
            activity: 'picking-topic',
            hoveredIndex: 0,
            answerStep: 0,
        };
    constructor(public dialogue: Dialogue) {
    }
    get currentLines(): string[] {
        if (this.state.activity === 'picking-topic') {
            // this.state.hoveredIndex = 0;
            return [`What would you like to talk about?`];
        }
        else if (this.state.activity === 'picking-question') {
            // this.state.hoveredIndex = 0;
            return [`What would you like to ask?`];
        }
        else if (this.state.activity === 'answering-question') {
            if (this.state.question) {
                return this.state.question.answer[this.state.answerStep];
            }
        }
        return [`What's up?`];
    }
    get currentOptions(): string[] {
        if (this.state.activity === 'picking-topic') {
            return this.dialogue.topics.map(topic => topic.kind);
        }
        else if (this.state.activity === 'picking-question') {
            if (this.state.topic) {
                return this.state.topic.questions.map(question => question.question);
            }
        }
        return [];
    }
    hoverOption(index: number) {
        this.state.hoveredIndex = index;
    }
    clickLeft() {
        // if (this.state.hoveredIndex) {
            console.log("tick left")
            let index = this.state.hoveredIndex;
            this.state.hoveredIndex = mod((index - 1), this.currentOptions.length);
        // }
    }

    clickRight() {
        let index = this.state.hoveredIndex;
        // if (index) {
            console.log("tick right")
            this.state.hoveredIndex = mod((index + 1), this.currentOptions.length);
        // }
    }
    selectOption(index: number) {
        console.log("SELECT OPT", index);
        if (this.state.activity === 'picking-topic') {
            this.state.topic = this.dialogue.topics[index];
            this.state.activity = 'picking-question';
            this.state.hoveredIndex = 0;
        }
        else if (this.state.activity === 'picking-question') {
            if (this.state.topic) {
                this.state.question = this.state.topic.questions[index];
                this.state.activity = 'answering-question';
                this.state.hoveredIndex = 0;
                this.state.answerStep = 0;
            }
        } else if (this.state.activity === 'answering-question') {
                // return this.state.question.answer[this.state.answerStep];
            if (this.state.question) {
                if (this.state.answerStep < this.state.question.answer.length-1) {
                    this.state.answerStep += 1
                } else {
                    this.state.activity = 'picking-topic'
                }
            }
        }
        else {
            console.warn("not sure what to do with selection ", index, this.state.activity);
        }
    }
}

import EventEmitter from 'eventemitter3';

// EventEmitter 인스턴스를 전역으로 하나만 생성하여 모든 컴포넌트에서 사용 가능하게 함
const emitter = new EventEmitter();

export default emitter;

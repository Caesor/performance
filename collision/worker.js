// class WorkerEmitter {
//     let messageMap = new Map();
//     constructor(private readonly worker: Worker) {
//       worker.onmessage = e => {
//         const { data } = e;
//         if (!data) return;
  
//         const { id, message } = decode(data);
//         const ret = this.messageMap.get(id);
//         if (!ret) return;
  
//         const { callback } = ret;
  
//         callback(message);
//         this.messageMap.delete(id);
//       };
//     }
//     emit<T, U>(type: string | number, message: T): Promise<U> {
//       return new Promise(resolve => {
//         const id = uuid();
//         const data = encode({
//           id,
//           type,
//           message
//         });
//         this.messageMap.set(id, {
//           type,
//           callback: (x: U) => {
//             resolve(x);
//           }
//         });
//         this.worker.postMessage(data.buffer, [data.buffer]);
//       });
//     }
//     terminate() {
//       this.worker.terminate();
//     }
//   }
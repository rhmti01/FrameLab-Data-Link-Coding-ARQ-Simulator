export class StopAndWaitSim {
  constructor(logger) {
    this.logger = logger;
    this.timeoutMs = 1000;
    this.errorProbability = 0.3;
    this.nextSeq = 0;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  shouldFail() {
    return Math.random() < this.errorProbability;
  }

  async sendFrame(seq) {
    this.logger(`فرستنده: ارسال فریم با شماره توالی ${seq}`);

    await this.sleep(700);

    if (this.shouldFail()) {
      this.logger(`کانال: خطا رخ داد و فریم ${seq} به گیرنده نرسید.`);
      return false;
    }

    this.logger(`گیرنده: فریم ${seq} دریافت شد.`);
    await this.sleep(500);

    if (this.shouldFail()) {
      this.logger(`گیرنده: ACK${seq} در کانال از بین رفت.`);
      return false;
    }

    this.logger(`فرستنده: ACK${seq} دریافت شد.`);
    return true;
  }

  async run(frameCount = 4) {
    this.logger('شروع شبیه‌سازی Stop-and-Wait');

    for (let i = 0; i < frameCount; i++) {
      let acknowledged = false;
      let attempts = 0;
      const seq = this.nextSeq;

      while (!acknowledged) {
        attempts++;
        this.logger(`--- تلاش ${attempts} برای فریم ${seq} ---`);

        const result = await this.sendFrame(seq);

        if (result) {
          acknowledged = true;
          this.logger(`فریم ${seq} با موفقیت تحویل شد.`);
          this.nextSeq = 1 - this.nextSeq;
        } else {
          this.logger(`Timeout / خطا برای فریم ${seq} رخ داد. ارسال مجدد...`);
          await this.sleep(this.timeoutMs);
        }
      }
    }

    this.logger('شبیه‌سازی Stop-and-Wait به پایان رسید.');
  }
}

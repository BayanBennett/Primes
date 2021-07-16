const DICT: Record<number, number> = {
  1e01: 4,
  1e02: 25,
  1e03: 168,
  1e04: 1229,
  1e05: 9592,
  1e06: 78498,
  1e07: 664579,
  1e08: 5761455,
  1e09: 50847534,
  1e10: 455052511,
};

class PrimeSieve {
  private readonly sieveSize: number;
  private bits: Buffer;

  constructor(sieveSize: number) {
    this.sieveSize = sieveSize;
    this.bits = Buffer.alloc(sieveSize);
  }

  public runSieve() {
    let factor = 3;
    const q = Math.sqrt(this.sieveSize);

    while (factor <= q) {
      for (let num = factor; num < this.sieveSize; num += 2) {
        if (!this.bits[num]) {
          factor = num;
          break;
        }
      }

      for (let num = factor * factor; num < this.sieveSize; num += factor * 2) {
        this.bits[num] = 1;
      }

      factor += 2;
    }
  }

  public printResults(showResults: boolean, duration: number, passes: number) {
    if (showResults) process.stdout.write("2, ");

    let count = 1;
    for (let num = 3; num < this.sieveSize; num += 2) {
      if (!this.bits[num]) {
        if (showResults) process.stdout.write(`${num}, `);
        count++;
      }
    }

    if (showResults) console.log();

    // TODO: Add old style too
    const avg = duration / passes;
    const countPrimes = this.countPrimes();
    const valid = this.validateResults();
    console.error(
      `Passes: ${passes}, Time: ${duration}, Avg: ${avg}, Limit: ${this.sieveSize}, Count1: ${countPrimes}, Count2: ${count}, Valid: ${valid}`
    );

    console.log(`marghidanu;${passes};${duration};1;algorithm=base,faithful=yes`);
  }

  private countPrimes(): number {
    let count = 1;

    for (let num = 3; num < this.sieveSize; num += 2) {
      if (!this.bits[num]) count++;
    }

    return count;
  }

  private validateResults(): boolean {
    return DICT[this.sieveSize] === this.countPrimes();
  }
}

// --- Main "function"

let passes = 0;
const startTime = Date.now();

while (true) {
  const sieve = new PrimeSieve(1e6);
  sieve.runSieve();

  passes++;
  const duration = (Date.now() - startTime) / 1000;
  if (duration >= 5) {
    sieve.printResults(false, duration, passes);
    break;
  }
}

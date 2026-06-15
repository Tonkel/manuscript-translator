import type { JobStatus } from "@/domain/types";
import { isTerminal } from "@/domain/job";
import { createLogger } from "@/lib/logger";

const log = createLogger("notifications");

export interface Notification {
  jobId: string;
  status: JobStatus;
  message: string;
  at: number;
}

/** Fan-out notifier. The demo just logs + buffers; a real impl would push to
 *  email/websocket. Only terminal states notify. */
class NotificationService {
  private sent: Notification[] = [];

  notifyStatus(jobId: string, status: JobStatus, clockMs: number): Notification | null {
    if (!isTerminal(status)) return null;
    const message =
      status === "complete" ? `Job ${jobId} finished` : `Job ${jobId} failed`;
    const n: Notification = { jobId, status, message, at: clockMs };
    this.sent.push(n);
    log.info(message);
    return n;
  }

  history(): Notification[] {
    return this.sent.slice();
  }
}

export const notificationService = new NotificationService();

import type { PressService } from "../contracts";
import { pressMentions } from "@/data/mock/press";
import { withLatency } from "./latency";

export const mockPressService: PressService = {
  async getPressMentions() {
    return withLatency(pressMentions, 0);
  },
};

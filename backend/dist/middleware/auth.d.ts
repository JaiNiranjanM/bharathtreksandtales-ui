import type { Request, Response, NextFunction } from 'express';
export interface AuthedRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}
export declare function authenticate(req: AuthedRequest, _res: Response, next: NextFunction): void;
export declare function authorize(...roles: string[]): (req: AuthedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map
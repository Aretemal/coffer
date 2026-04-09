import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from '../graphql/models';
export declare class AuthResolver {
    private readonly auth;
    constructor(auth: AuthService);
    register(input: RegisterInput): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    }>;
    login(input: LoginInput): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    }>;
}

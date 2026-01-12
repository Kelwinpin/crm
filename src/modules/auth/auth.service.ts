import { verifyEmail } from "src/shared/utils/verifyEmail";
import { PrismaService } from "../prisma/prisma.service";
import { isCPFValid } from "src/shared/utils/isCPFValid";
import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { handlePrismaError } from "src/shared/utils/handle-prisma-error";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}
    
    async login(login: string, password: string) {
        try {
            let user
    
            const isEmail = verifyEmail(login);
             
            if (isEmail) {
                user = await this.prisma.users.findUnique({
                    where: {
                        email: login,
                    },
                });
            }


            if (!isEmail) {
                const verifyCPF = isCPFValid(login);

                if (!verifyCPF) {
                    throw new ConflictException('Login não encontrado em nossa base de dados');
                }

                user = await this.prisma.users.findFirst({
                    where: {
                        cpf: login,
                    },
                });
            }

            if (!user) {
                throw new ConflictException('Login não encontrado em nossa base de dados');
            }

            const comparePassword = await bcrypt.compare(password, user.password);

            if (!comparePassword) {
                throw new ConflictException('Senha incorreta');
            }

            delete user.password;

            const token = this.jwtService.sign(user);

            return {
                access_token: token
            };
        } catch (error) {
            handlePrismaError(error);
        }
    }
}
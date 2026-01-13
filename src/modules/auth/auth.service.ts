import { verifyEmail } from "src/shared/utils/verify-email";
import { PrismaService } from "../prisma/prisma.service";
import { isCPFValid } from "src/shared/utils/is-cpf-valid";
import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { handlePrismaError } from "src/shared/utils/handle-prisma-error";
import { PermissionsService } from "../permissions/permissions.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private permissionsService: PermissionsService
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

            const permissions = await this.permissionsService.getPermissionsByUserId(user.id);            

            if (!comparePassword) {
                throw new ConflictException('Senha incorreta');
            }

            delete user.password;

            const token = this.jwtService.sign(user);

            const p = this.jwtService.sign({ permissions });

            return {
                access_token: token,
                p: p,
            };
        } catch (error) {
            handlePrismaError(error);
        }
    }
}
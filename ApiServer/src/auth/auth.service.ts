import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ethers } from 'ethers';
import { ConfigService } from 'src/config/config.service';
import { UserType, User } from 'src/user/user.schema';
import { ServiceBase } from 'src/common/serviceBase';

export interface JwtPayload {
  userId: string;
  userType: UserType;
  // TODO: Add Role or permissions here
}

export interface LoginResponse {
  accessToken: string;
  userId: string;
  ethAddress: string;
}

export interface AccessPermit {
  permit: string;
}

@Injectable()
export class AuthService extends ServiceBase {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super(AuthService.name);
  }

  async generatePermit(ethAddress): Promise<AccessPermit> {
    const serverAccountWallet = await ethers.Wallet.fromMnemonic(
      this.config.get('serverWallet').mnemonic,
    );
    const returnMessage = await serverAccountWallet.signMessage(
      `${this.config.get('jwt').permitSalt} - ${ethAddress.toLowerCase()}`,
    );
    
    return { permit: returnMessage };
  }

  async validateUserSignature(signedMessage, ethAddress): Promise<boolean> {
    const { permit } = await this.generatePermit(ethAddress);
    try {
      const addressOfSigner = await ethers.utils.verifyMessage(
        permit,
        signedMessage,
      );
      return addressOfSigner.toLowerCase() === ethAddress.toLowerCase();
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async login(signedPermit: string, ethAddress: string): Promise<LoginResponse> {
    const isSignatureValid = await this.validateUserSignature(signedPermit, ethAddress);
    if (!isSignatureValid) {
      throw new UnauthorizedException('Invalid message signature');
    }

    const _user = await this.userService.getUserByEthAddress(ethAddress);
    let user: User;

    if (_user) {
      user = _user;
    } else {
      const newUser = await this.userService.create(ethAddress);
      user = newUser;
    }

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        type: user.type,
      },
      {
        expiresIn: `${this.config.get('jwt').expiry}h`,
        subject: ethAddress,
        issuer: this.config.get('app').host,
      },
    );

    return { accessToken: accessToken, userId: user.id, ethAddress: user.ethAddress };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.findById(payload.userId);
  }
}

import {injectable} from "tsyringe";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

const {AuthenticationDetails, CognitoUserPool, CognitoUser} = AmazonCognitoIdentity;

interface IAuthenticationDetailsData {
    Username: string;
    Password: string;
}

const poolData = {
    UserPoolId: process.env.COGNITO_POOL_ID ?? '',
    ClientId: process.env.COGNITO_CLIENT_ID ?? '',
};

@injectable()
export class AuthService {
    async auth(details: IAuthenticationDetailsData) {
        const authenticationDetails = new AuthenticationDetails(details);
        const userPool = new CognitoUserPool(poolData);
        const cognitoUser = new CognitoUser({
            Username: details.Username,
            Pool: userPool,
        });

        return new Promise(((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: result => resolve(result.getAccessToken().getJwtToken()),
                onFailure: err => reject(err),
            });
        }))
    }
}

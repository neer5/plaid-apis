import {
  Configuration,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments
} from 'plaid';
import config from 'config';

const configuration = new Configuration({
  basePath: PlaidEnvironments[config.get('PLAID_ENV') as string],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': config.get('PLAID_CLIENT_ID'),
      'PLAID-SECRET': config.get('PLAID_SECRET'),
      'Plaid-Version': '2020-09-14'
    }
  }
});

export class Plaid {
  private client: PlaidApi;

  public constructor() {
    this.client = new PlaidApi(configuration);
  }

  public async createLinkToken({ clientUserId }: { clientUserId: string }) {
    const configs: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: clientUserId
      },
      client_name: 'Plaid Quickstart',
      products: config.get('PLAID_PRODUCTS'),
      country_codes: config.get('PLAID_COUNTRY_CODES'),
      language: 'en'
    };

    // if (PLAID_REDIRECT_URI !== '') {
    //   configs.redirect_uri = PLAID_REDIRECT_URI;
    // }

    // if (PLAID_ANDROID_PACKAGE_NAME !== '') {
    //   configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
    // }
    const { data } = await this.client.linkTokenCreate(configs);
    return data;
    // prettyPrintResponse(createTokenResponse);
    // response.json(createTokenResponse.data);
  }
}

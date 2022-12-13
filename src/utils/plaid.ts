import {
  Configuration,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  TransactionsSyncRequest,
  TransactionsSyncResponse
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

  public async exchangeAccessToken(publicToken: string) {
    const tokenResponse = await this.client.itemPublicTokenExchange({
      public_token: publicToken
    });
    return tokenResponse.data.access_token;
  }

  public async createLinkToken({
    clientUserId,
    plaidRedirectUri
  }: {
    clientUserId: string;
    plaidRedirectUri?: string;
  }) {
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

    if (plaidRedirectUri !== '') {
      configs.redirect_uri = plaidRedirectUri;
    }
    const { data } = await this.client.linkTokenCreate(configs);
    return data;
  }

  public async getTransactions(
    accessToken: string,
    { cursor, count }: { cursor?: string; count?: number }
  ) {
    // Set cursor to empty to receive all historical updates
    const request: TransactionsSyncRequest = {
      access_token: accessToken,
      count: Number(count) || 10,
      cursor
    };
    const { data }: { data: TransactionsSyncResponse } =
      await this.client.transactionsSync(request);
    return data;
  }
}

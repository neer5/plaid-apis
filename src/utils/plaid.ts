import {
  Configuration,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Transaction
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
      public_token: publicToken,
    });
    return tokenResponse.data.access_token;
  }

  public async createLinkToken({ clientUserId, plaidRedirectUri }: { clientUserId: string, plaidRedirectUri?:string }) {
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

  public async getTransactions(accessToken: string) {
      // Set cursor to empty to receive all historical updates
      let cursor = null;

      // New transaction updates since "cursor"
      let added:any = [];
      let modified:any = [];
      // Removed transaction ids
      let removed:any = [];
      let hasMore = true;
      // Iterate through each page of new transaction updates for item
      while (hasMore) {
        const request:any = {
          access_token: accessToken,
          cursor,
        };
        const { data } : {data: any}= await this.client.transactionsSync(request);
        // Add this page of results
        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;
        // Update cursor to the next cursor
        cursor = data.next_cursor;
        // prettyPrintResponse(response);
      }
      return added;
      // const compareTxnsByDateAscending = (a, b) => (a.date > b.date) - (a.date < b.date);
      // // Return the 8 most recent transactions
      // const recently_added = [...added].sort(compareTxnsByDateAscending).slice(-8);
      // return {latest_transactions: recently_added};
  }
}

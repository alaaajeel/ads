import { CreditWallet, CreditTransaction, Ad } from '../../types';

export class CreditWalletService {
  private static WALLET_STORAGE_KEY = 'ai_ads_credit_wallet';
  private static TX_STORAGE_KEY = 'ai_ads_credit_transactions';

  static getWallet(userId: string): CreditWallet {
    try {
      const stored = localStorage.getItem(`${this.WALLET_STORAGE_KEY}_${userId}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    
    // Default initial wallet with 15 trial credits (Acceptance Scenario 1)
    const initialWallet: CreditWallet = {
      id: `wlt_${userId}`,
      user_id: userId,
      balance: 15,
      updated_at: new Date().toISOString()
    };
    this.saveWallet(initialWallet);

    // Initial sign-up trial transaction record
    this.recordTransaction({
      id: `tx_init_${Date.now()}`,
      wallet_id: initialWallet.id,
      type: 'add',
      amount: 15,
      related_ad_id: null,
      reason: 'رصيد تجريبي ترحيبي عند إنشاء الحساب (15 كريدت مجانية)',
      created_at: new Date().toISOString()
    });

    return initialWallet;
  }

  static saveWallet(wallet: CreditWallet): void {
    try {
      localStorage.setItem(`${this.WALLET_STORAGE_KEY}_${wallet.user_id}`, JSON.stringify(wallet));
    } catch {}
  }

  static getTransactions(walletId: string): CreditTransaction[] {
    try {
      const stored = localStorage.getItem(`${this.TX_STORAGE_KEY}_${walletId}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  }

  static recordTransaction(tx: CreditTransaction): void {
    const list = this.getTransactions(tx.wallet_id);
    list.unshift(tx);
    try {
      localStorage.setItem(`${this.TX_STORAGE_KEY}_${tx.wallet_id}`, JSON.stringify(list));
    } catch {}
  }

  /**
   * Enforces Constitution Principle IV:
   * Deduct credit before any AI generation job is initiated.
   * If balance is insufficient, throws an error immediately without any external AI call.
   */
  static deductForGeneration(
    wallet: CreditWallet,
    amount: number,
    adId: string,
    description: string
  ): { success: boolean; newWallet: CreditWallet; transaction?: CreditTransaction; error?: string } {
    if (wallet.balance < amount) {
      return {
        success: false,
        newWallet: wallet,
        error: `رصيد الكريدت غير كافٍ! المطلوب: ${amount} كريدت، المتبقي لديك: ${wallet.balance} كريدت. يرجى شحن الرصيد للمتابعة.`
      };
    }

    const updatedWallet: CreditWallet = {
      ...wallet,
      balance: wallet.balance - amount,
      updated_at: new Date().toISOString()
    };

    const transaction: CreditTransaction = {
      id: `tx_deduct_${Date.now()}`,
      wallet_id: wallet.id,
      type: 'deduct',
      amount: amount,
      related_ad_id: adId,
      reason: description,
      created_at: new Date().toISOString()
    };

    this.saveWallet(updatedWallet);
    this.recordTransaction(transaction);

    return {
      success: true,
      newWallet: updatedWallet,
      transaction
    };
  }

  /**
   * Enforces FR-014:
   * Automatic refund of deducted credits when generation fails due to AI provider failure.
   */
  static refundFailedGeneration(
    wallet: CreditWallet,
    amount: number,
    adId: string,
    reason: string
  ): { newWallet: CreditWallet; transaction: CreditTransaction } {
    const updatedWallet: CreditWallet = {
      ...wallet,
      balance: wallet.balance + amount,
      updated_at: new Date().toISOString()
    };

    const transaction: CreditTransaction = {
      id: `tx_refund_${Date.now()}`,
      wallet_id: wallet.id,
      type: 'refund',
      amount: amount,
      related_ad_id: adId,
      reason: `استرجاع تلقائي (FR-014): ${reason}`,
      created_at: new Date().toISOString()
    };

    this.saveWallet(updatedWallet);
    this.recordTransaction(transaction);

    return {
      newWallet: updatedWallet,
      transaction
    };
  }

  /**
   * Add credits (purchase or plan upgrade)
   */
  static addCredits(
    wallet: CreditWallet,
    amount: number,
    reason: string
  ): { newWallet: CreditWallet; transaction: CreditTransaction } {
    const updatedWallet: CreditWallet = {
      ...wallet,
      balance: wallet.balance + amount,
      updated_at: new Date().toISOString()
    };

    const transaction: CreditTransaction = {
      id: `tx_add_${Date.now()}`,
      wallet_id: wallet.id,
      type: 'add',
      amount: amount,
      related_ad_id: null,
      reason,
      created_at: new Date().toISOString()
    };

    this.saveWallet(updatedWallet);
    this.recordTransaction(transaction);

    return {
      newWallet: updatedWallet,
      transaction
    };
  }
}

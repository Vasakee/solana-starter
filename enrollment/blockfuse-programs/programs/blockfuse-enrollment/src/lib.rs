use anchor_lang::prelude::*;

declare_id!("5v3j8M2TNpbqJzxuP3K7sGdh848rqVLwhR6iK7iLAf7V");

#[program]
pub mod blockfuse_enrollment {
    use super::*;

    /// Enroll a student in BlockFuse Labs bootcamp
    /// Records their GitHub handle on-chain
    pub fn complete(ctx: Context<Complete>, github: Vec<u8>) -> Result<()> {
        let enrollment = &mut ctx.accounts.enrollment;
        enrollment.github = github;
        enrollment.key = ctx.accounts.signer.key();
        msg!("BlockFuse enrollment completed for: {}", ctx.accounts.signer.key());
        Ok(())
    }

    /// Update an existing enrollment (in case student needs to change their GitHub handle)
    pub fn update(ctx: Context<Update>, github: Vec<u8>) -> Result<()> {
        let enrollment = &mut ctx.accounts.enrollment;

        // Verify the signer matches the original enrollment
        require!(
            enrollment.key == ctx.accounts.signer.key(),
            EnrollmentError::Unauthorized
        );

        enrollment.github = github;
        msg!("BlockFuse enrollment updated for: {}", ctx.accounts.signer.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Complete<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + EnrollmentAccount::INIT_SPACE,
        seeds = [b"enrollment", signer.key().as_ref()],
        bump
    )]
    pub enrollment: Account<'info, EnrollmentAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"enrollment", signer.key().as_ref()],
        bump
    )]
    pub enrollment: Account<'info, EnrollmentAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct EnrollmentAccount {
    #[max_len(32)]
    pub github: Vec<u8>,  // GitHub handle (up to 32 bytes)
    pub key: Pubkey,      // Student's wallet address
}

#[error_code]
pub enum EnrollmentError {
    #[msg("Unauthorized: Only the original enrollee can update their account")]
    Unauthorized,
}

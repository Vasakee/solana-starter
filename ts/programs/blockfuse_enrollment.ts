import { Idl } from "@coral-xyz/anchor";

export const IDL: Idl = {
  address: "5v3j8M2TNpbqJzxuP3K7sGdh848rqVLwhR6iK7iLAf7V",
  metadata: {
    name: "blockfuse_enrollment",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "complete",
      discriminator: [0, 77, 224, 147, 136, 25, 88, 76],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "enrollment",
          writable: true,
          pda: {
            seeds: [
              { kind: "const", value: [101, 110, 114, 111, 108, 108, 109, 101, 110, 116] },
              { kind: "account", path: "signer" },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "github",
          type: "bytes",
        },
      ],
    },
    {
      name: "update",
      discriminator: [219, 200, 88, 176, 158, 63, 253, 127],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "enrollment",
          writable: true,
          pda: {
            seeds: [
              { kind: "const", value: [101, 110, 114, 111, 108, 108, 109, 101, 110, 116] },
              { kind: "account", path: "signer" },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "github",
          type: "bytes",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "enrollmentAccount",
      discriminator: [35, 115, 199, 23, 164, 37, 226, 217],
    },
  ],
  types: [
    {
      name: "enrollmentAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "github",
            type: "bytes",
          },
          {
            name: "key",
            type: "pubkey",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "unauthorized",
      msg: "Unauthorized: Only the original enrollee can update their account",
    },
  ],
};

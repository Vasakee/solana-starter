#!/bin/bash

# Script to update references from WBA to BlockFuse
# Usage: ./update-to-blockfuse.sh <YOUR_PROGRAM_ID>

set -e

if [ -z "$1" ]; then
    echo "Error: Please provide your BlockFuse program ID"
    echo "Usage: ./update-to-blockfuse.sh <YOUR_PROGRAM_ID>"
    exit 1
fi

PROGRAM_ID=$1

echo "=========================================="
echo "Updating to BlockFuse Enrollment Program"
echo "Program ID: $PROGRAM_ID"
echo "=========================================="

# Update TypeScript enroll scripts
echo "📝 Updating ts/prereqs/enroll.ts..."
if [ -f "ts/prereqs/enroll.ts" ]; then
    sed -i.bak "s/HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1/$PROGRAM_ID/g" ts/prereqs/enroll.ts
    sed -i.bak 's/BflPrereq/BlockfuseEnrollment/g' ts/prereqs/enroll.ts
    sed -i.bak 's/bfl_prereq/blockfuse_enrollment/g' ts/prereqs/enroll.ts
    sed -i.bak 's/"prereq"/"enrollment"/g' ts/prereqs/enroll.ts
    sed -i.bak 's/prereq:/enrollment:/g' ts/prereqs/enroll.ts
    echo "✅ Updated ts/prereqs/enroll.ts"
fi

echo "📝 Updating ts-complete/prereqs/enroll.ts..."
if [ -f "ts-complete/prereqs/enroll.ts" ]; then
    sed -i.bak "s/HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1/$PROGRAM_ID/g" ts-complete/prereqs/enroll.ts
    sed -i.bak 's/BflPrereq/BlockfuseEnrollment/g' ts-complete/prereqs/enroll.ts
    sed -i.bak 's/bfl_prereq/blockfuse_enrollment/g' ts-complete/prereqs/enroll.ts
    sed -i.bak 's/"prereq"/"enrollment"/g' ts-complete/prereqs/enroll.ts
    sed -i.bak 's/prereq:/enrollment:/g' ts-complete/prereqs/enroll.ts
    echo "✅ Updated ts-complete/prereqs/enroll.ts"
fi

# Update Rust program reference
echo "📝 Updating rs/src/programs/bfl_prereq.rs..."
if [ -f "rs/src/programs/bfl_prereq.rs" ]; then
    sed -i.bak "s/HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1/$PROGRAM_ID/g" rs/src/programs/bfl_prereq.rs
    sed -i.bak 's/"name": "bfl_prereq"/"name": "blockfuse_enrollment"/g' rs/src/programs/bfl_prereq.rs
    sed -i.bak 's/"prereq"/"enrollment"/g' rs/src/programs/bfl_prereq.rs
    sed -i.bak 's/PrereqAccount/EnrollmentAccount/g' rs/src/programs/bfl_prereq.rs
    echo "✅ Updated rs/src/programs/bfl_prereq.rs"
fi

# Update README
echo "📝 Updating README.md..."
if [ -f "README.md" ]; then
    sed -i.bak "s/HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1/$PROGRAM_ID/g" README.md
    sed -i.bak 's/WBA prereq program/BlockFuse enrollment program/g' README.md
    sed -i.bak 's/BFL on-chain program/BlockFuse enrollment program/g' README.md
    sed -i.bak 's/BFL prereq program/BlockFuse enrollment program/g' README.md
    sed -i.bak 's/\["prereq", yourPublicKey\]/\["enrollment", yourPublicKey\]/g' README.md
    sed -i.bak 's/seeds = \["prereq"/seeds = \["enrollment"/g' README.md
    echo "✅ Updated README.md"
fi

# Clean up backup files
echo "🧹 Cleaning up backup files..."
find . -name "*.bak" -type f -delete

echo ""
echo "=========================================="
echo "✅ Update Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Copy your TypeScript IDL file:"
echo "   cp blockfuse-programs/target/idl/blockfuse_enrollment.json ts/programs/blockfuse_enrollment_idl.json"
echo ""
echo "2. Create ts/programs/blockfuse_enrollment.ts (see CREATE_BLOCKFUSE_PROGRAM.md Step 7)"
echo ""
echo "3. Test the enrollment:"
echo "   cd ts && yarn enroll"
echo ""
echo "4. Verify on Solana Explorer"
echo ""

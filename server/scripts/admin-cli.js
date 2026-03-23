#!/usr/bin/env node

/**
 * Admin CLI Tool for Bishop Estates Cabana Club
 * Manage members directly via command line
 * 
 * Usage:
 *   node scripts/admin-cli.js list                    # List all members
 *   node scripts/admin-cli.js list --status=pending   # List pending payments
 *   node scripts/admin-cli.js get <id>                # Get member by ID
 *   node scripts/admin-cli.js status <id> <status>    # Update payment status
 *   node scripts/admin-cli.js stats                   # Show statistics
 */

const path = require('path');
const {
  readMembers,
  writeMembers,
  getMemberById,
  getMembersByStatus,
  getStatistics
} = require('../src/utils/database');

const { formatCurrency, formatDate } = require('../src/utils/helpers');

const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];
const flags = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    acc[key] = value || true;
  }
  return acc;
}, {});

async function main() {
  try {
    switch (command) {
      case 'list':
        await listMembers();
        break;

      case 'get':
        if (!arg1) {
          console.error('❌ Usage: admin-cli.js get <member-id>');
          process.exit(1);
        }
        await getMember(arg1);
        break;

      case 'status':
        if (!arg1 || !arg2) {
          console.error('❌ Usage: admin-cli.js status <member-id> <pending|paid|overdue>');
          process.exit(1);
        }
        await updateStatus(arg1, arg2);
        break;

      case 'stats':
        await showStats();
        break;

      case 'help':
        showHelp();
        break;

      default:
        console.log('Bishop Estates Cabana Club - Admin CLI\n');
        showHelp();
        process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function listMembers() {
  const members = flags.status
    ? await getMembersByStatus(flags.status)
    : await readMembers();

  if (!members.length) {
    console.log('📭 No members found');
    return;
  }

  console.log(`\n📋 Members (${members.length})\n`);
  console.log('ID                   | Name              | Email                    | Tier      | Status   | Amount');
  console.log('-'.repeat(110));

  members.forEach(m => {
    const id = m.id.substring(0, 20).padEnd(20);
    const name = `${m.firstName} ${m.lastName}`.substring(0, 17).padEnd(17);
    const email = m.email.substring(0, 24).padEnd(24);
    const tier = m.membershipTier.padEnd(9);
    const status = m.paymentStatus.padEnd(8);
    const amount = formatCurrency(m.amount);

    console.log(`${id} | ${name} | ${email} | ${tier} | ${status} | ${amount}`);
  });

  console.log('-'.repeat(110));
  console.log(`\nTotal: ${members.length} members`);
  console.log(`\n💡 Tip: Use --status=pending to filter by payment status`);
}

async function getMember(id) {
  const member = await getMemberById(id);

  if (!member) {
    console.error(`❌ Member not found: ${id}`);
    process.exit(1);
  }

  console.log('\n📌 Member Details\n');
  console.log(`ID:              ${member.id}`);
  console.log(`Name:            ${member.firstName} ${member.lastName}`);
  console.log(`Email:           ${member.email}`);
  console.log(`Phone:           ${member.phone}`);
  console.log(`Membership:      ${member.membershipTier}`);
  console.log(`Amount:          ${formatCurrency(member.amount)}`);
  console.log(`Payment Status:  ${member.paymentStatus}`);
  console.log(`Created:         ${formatDate(member.createdAt)}`);
  console.log(`Updated:         ${formatDate(member.updatedAt)}`);
  console.log(`\nVenmo Link:      ${member.venmoLink}`);
  console.log('\n');
}

async function updateStatus(id, status) {
  if (!['pending', 'paid', 'overdue'].includes(status)) {
    console.error('❌ Invalid status. Must be: pending, paid, or overdue');
    process.exit(1);
  }

  const members = await readMembers();
  const memberIndex = members.findIndex(m => m.id === id);

  if (memberIndex === -1) {
    console.error(`❌ Member not found: ${id}`);
    process.exit(1);
  }

  const oldStatus = members[memberIndex].paymentStatus;
  members[memberIndex].paymentStatus = status;
  members[memberIndex].updatedAt = new Date().toISOString();

  await writeMembers(members);

  const member = members[memberIndex];
  console.log(`\n✅ Status updated!\n`);
  console.log(`Member:   ${member.firstName} ${member.lastName}`);
  console.log(`Email:    ${member.email}`);
  console.log(`Status:   ${oldStatus} → ${status}`);
  console.log(`Updated:  ${formatDate(member.updatedAt)}\n`);
}

async function showStats() {
  const stats = await getStatistics();

  console.log('\n📊 Member Statistics\n');
  console.log(`Total Members:        ${stats.totalMembers}`);
  console.log(`\nPayment Status:`);
  console.log(`  ✅ Paid:            ${stats.paid}`);
  console.log(`  ⏳ Pending:         ${stats.pending}`);
  console.log(`  ⚠️  Overdue:        ${stats.overdue}`);
  console.log(`\nMembership Tiers:`);
  console.log(`  💎 Premium:         ${stats.byTier.premium}`);
  console.log(`  ⭐ Standard:        ${stats.byTier.standard}`);
  console.log(`  📦 Basic:           ${stats.byTier.basic}`);
  console.log(`\nRevenue:`);
  console.log(`  💰 Paid:            ${formatCurrency(stats.revenue.paid)}`);
  console.log(`  🔜 Pending:         ${formatCurrency(stats.revenue.pending)}`);
  console.log(`  📈 Total:           ${formatCurrency(stats.revenue.paid + stats.revenue.pending)}`);
  console.log('\n');
}

function showHelp() {
  console.log(`
Bishop Estates Cabana Club - Admin CLI
=====================================

Commands:

  list [--status=STATUS]
    List all members, optionally filtered by payment status
    
    Examples:
      node admin-cli.js list
      node admin-cli.js list --status=pending
      node admin-cli.js list --status=paid

  get <id>
    Get details for a specific member
    
    Example:
      node admin-cli.js get MEM-E5K8L2-A3B9C5

  status <id> <status>
    Update a member's payment status
    
    Example:
      node admin-cli.js status MEM-E5K8L2-A3B9C5 paid

  stats
    Show member statistics and revenue summary
    
    Example:
      node admin-cli.js stats

  help
    Show this help message

Options:

  --status=<status>
    Filter members by status (pending, paid, overdue)
    Used with 'list' command

Examples:

  List all pending payments:
    node admin-cli.js list --status=pending

  Mark a member as paid:
    node admin-cli.js status MEM-E5K8L2-A3B9C5 paid

  View statistics:
    node admin-cli.js stats
`);
}

main();

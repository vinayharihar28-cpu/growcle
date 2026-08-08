# Authorization & RBAC

---

## Architecture
The system uses a comprehensive Role-Based Access Control (RBAC) model configured as follows:

\`User\` → \`OrganizationUser\` → \`OrganizationUserRole\` → \`Role\` → \`RolePermission\` → \`Permission\`

## Model Rules
- Within an organization, a user may have **multiple roles** simultaneously.
- Permissions are inherited from all assigned roles.
- The effective permission set is the **union of all permissions** assigned through those roles.

## Permission Naming
Permissions follow a \`resource.action\` convention. Examples:
- \`member.create\`, \`member.read\`, \`member.update\`, \`member.delete\`
- \`meeting.create\`, \`meeting.attendance.manage\`
- \`visitor.convert\`
- \`finance.view\`, \`finance.manage\`
- \`organization.manage\`, \`chapter.manage\`

## Workspace Switching
Administrative users remain normal members and switch workspaces to access administrative capabilities. 

For example, a Vice President can:
1. Switch to the **Member Workspace** to record their own visitors, referrals, and 1-to-1s.
2. Switch to the **Administration Workspace** to perform chapter management tasks.

The workspace switch changes available navigation and permissions, but does not require logging in again. There are NO separate user accounts for administrative access.

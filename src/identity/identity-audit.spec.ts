import { auditIdentities, type IdentityAuditRecord } from './identity-audit';

describe('auditIdentities', () => {
  it('reports canonical username and cross-role email conflicts without mutating fixtures', () => {
    const records: IdentityAuditRecord[] = [
      {
        id: 'user-1',
        username: 'João.Silva',
        emails: [{ source: 'studentProfile', value: 'Aluno@Email.com ' }],
        document: '529.982.247-25',
      },
      {
        id: 'user-2',
        username: 'joao.silva',
        emails: [{ source: 'personalProfile', value: 'aluno@email.com' }],
      },
    ];
    const before = JSON.stringify(records);

    const report = auditIdentities(records);

    expect(report.usernameConflicts).toEqual([
      {
        canonical: 'joao.silva',
        userIds: ['user-1', 'user-2'],
        values: ['João.Silva', 'joao.silva'],
      },
    ]);
    expect(report.emailConflicts).toEqual([
      {
        canonical: 'aluno@email.com',
        userIds: ['user-1', 'user-2'],
        values: ['Aluno@Email.com', 'aluno@email.com'],
      },
    ]);
    expect(report.invalidDocuments).toEqual([]);
    expect(JSON.stringify(records)).toBe(before);
  });

  it('reports invalid emails and documents while ignoring empty legacy values', () => {
    const report = auditIdentities([
      {
        id: 'user-1',
        username: 'aluno1',
        emails: [{ source: 'studentProfile', value: 'email-invalido' }],
        document: '111.111.111-11',
      },
      {
        id: 'user-2',
        username: 'aluno2',
        emails: [{ source: 'studentProfile', value: '  ' }],
        document: null,
      },
    ]);

    expect(report.invalidEmails).toEqual([
      expect.objectContaining({ userId: 'user-1', reason: 'invalid_format' }),
    ]);
    expect(report.invalidDocuments).toEqual([
      expect.objectContaining({
        userId: 'user-1',
        reason: 'invalid_check_digits',
      }),
    ]);
    expect(report.usersWithLegacyDocuments).toBe(1);
  });
});

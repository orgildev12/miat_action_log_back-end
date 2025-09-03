export const AlogTestQueries = {
  getAllRecords: `
    SELECT id, name FROM alog_test ORDER BY id
  `,

  createRecord: `
    INSERT INTO alog_test (name) VALUES (:name)
  `,

  getRecordById: `
    SELECT * FROM alog_test WHERE id = :id
  `,

  updateRecord: `
    UPDATE alog_test SET name = :name WHERE id = :id
  `,

  deleteRecord: `
    DELETE FROM alog_test WHERE id = :id
  `
};

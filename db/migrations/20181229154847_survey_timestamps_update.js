exports.up = function(knex, Promise) {
  return knex.schema.table('surveys', function(table) {
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  table.dropColumn('created_at');
  table.dropColumn('updated_at');
};

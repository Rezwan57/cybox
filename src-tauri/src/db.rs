use mysql::{Pool, Opts, OptsBuilder, PooledConn};
use dotenvy::dotenv;
use std::env;
use once_cell::sync::Lazy;

static POOL: Lazy<Pool> = Lazy::new(|| {
    dotenv().ok();

    let url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in your .env file");

    let opts = Opts::from_url(&url).expect("Failed to parse DATABASE_URL");
    let builder = OptsBuilder::from_opts(opts);
    Pool::new(builder).expect("Failed to create database pool")
});

pub fn get_db_connection() -> Result<PooledConn, mysql::Error> {
    POOL.get_conn()
}

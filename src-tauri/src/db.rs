use mysql::{Pool, Opts, OptsBuilder, PooledConn};

pub fn get_db_connection() -> Result<PooledConn, mysql::Error> {
    let url = "mysql://root:EXfcIzMizHCSmtjRuloLfFwGPWhQLlxF@yamabiko.proxy.rlwy.net:42351/railway";
    
    let opts = Opts::from_url(&url)?;
    let builder = OptsBuilder::from_opts(opts);
    let pool = Pool::new(builder)?;
    let conn = pool.get_conn()?;
    Ok(conn)
}
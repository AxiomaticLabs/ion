use std::fs;
use std::time::Instant;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_file_read_performance() {
        let start = Instant::now();
        let path = "/Users/amol/Developer/ion/large_file.txt";

        // Read the entire file into memory
        let data = fs::read(path).expect("Failed to read file");

        let bytes_read = data.len();
        let duration = start.elapsed();
        println!("rust read took {} ms", duration.as_millis());
        println!("completed reading files, bytes: {}", bytes_read);

        assert_eq!(bytes_read, 1073741824); // 1GB
        assert!(duration.as_millis() < 2000); // Should be under 2s
    }
}

fn main() {
    println!("Run 'cargo test' to execute the file read performance test.");
}
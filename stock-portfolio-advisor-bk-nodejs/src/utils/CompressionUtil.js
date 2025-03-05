/**
 * Utility class for compression and decompression of data
 * Converted from Java implementation to Node.js
 */
const zlib = require('zlib');
const util = require('util');

// Promisify zlib methods for async/await usage
// Using gzip instead of deflate for better PostgreSQL compatibility
const gzip = util.promisify(zlib.gzip);
const gunzip = util.promisify(zlib.gunzip);

class CompressionUtil {
  /**
   * Compress a string into a Buffer using zlib gzip
   * @param {string} data - String data to compress
   * @returns {Promise<Buffer>} - Compressed data as Buffer
   */
  static async compress(data) {
    if (data == null || data === '') {
      return Buffer.alloc(0);
    }
    
    try {
      // Use gzip instead of deflate for better PostgreSQL compatibility
      const compressed = await gzip(Buffer.from(data));
      return compressed;
    } catch (error) {
      console.error('Compression error:', error);
      throw new Error('Failed to compress data: ' + error.message);
    }
  }

  /**
   * Decompress a Buffer into a string using zlib gunzip
   * @param {Buffer} compressedData - Compressed data as Buffer
   * @returns {Promise<string>} - Decompressed string
   */
  static async decompress(compressedData) {
    if (!compressedData || !Buffer.isBuffer(compressedData) || compressedData.length === 0) {
      return '';
    }
    
    try {
      // Use gunzip instead of inflate for better PostgreSQL compatibility
      const result = await gunzip(compressedData);
      return result.toString();
    } catch (error) {
      console.error('Decompression error:', error);
      throw new Error('Failed to decompress data: ' + error.message);
    }
  }

  /**
   * Safely decompress data that might not be compressed
   * @param {Buffer|any} data - Data to decompress
   * @returns {Promise<string>} - Decompressed string or original data as string
   */
  static async safeDecompress(data) {
    if (!data) {
      return '';
    }
    
    // Ensure we have a buffer
    let buffer;
    if (!Buffer.isBuffer(data)) {
      // Handle numeric values or other types by converting to string first
      const stringData = typeof data === 'number' ? String(data) : data.toString();
      buffer = Buffer.from(stringData);
    } else {
      buffer = data;
    }
    
    try {
      // Try to decompress using gunzip
      const decompressed = await gunzip(buffer);
      return decompressed.toString();
    } catch (error) {
      // Try to detect if this is a gzip error or just uncompressed data
      if (error.code === 'Z_DATA_ERROR') {
        // This is likely uncompressed data
        console.log('Data is not compressed, using as-is');
        return buffer.toString();
      }
      
      // For other errors, log and still try to return something useful
      console.error('Error in safeDecompress:', error.message);
      return buffer.toString();
    }
  }
}

module.exports = CompressionUtil;

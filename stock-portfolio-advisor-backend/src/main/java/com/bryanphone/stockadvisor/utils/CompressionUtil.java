package com.bryanphone.stockadvisor.utils;

import lombok.extern.java.Log;

import java.io.ByteArrayOutputStream;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

@Log
public class CompressionUtil {
    // Compress a string into a byte array using gzip
    public static byte[] compress(String data) {
        if (data == null || data.isEmpty()) {
            return new byte[0];
        }

        Deflater deflater = new Deflater();
        deflater.setInput(data.getBytes());
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length());
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer);
            outputStream.write(buffer, 0, count);
        }
        deflater.end();

        return outputStream.toByteArray();
    }

    // Decompress a byte array into a string using gzip
    public static String decompress(byte[] compressedData) {
        if (compressedData == null || compressedData.length == 0) {
            return "";
        }

        Inflater inflater = new Inflater();
        inflater.setInput(compressedData);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(compressedData.length);
        byte[] buffer = new byte[1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                outputStream.write(buffer, 0, count);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to decompress data", e);
        } finally {
            inflater.end();
        }

        return outputStream.toString();
    }
}

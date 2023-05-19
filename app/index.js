const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const crypto = require('crypto');

// BodyParser kullanmadım gelen yanıtları doğrudan express json ile çevirdim.
// Expressten gelen verileri json almak için gerekli kod.
app.use(bodyParser.json());
// Url dönüştürme işlemi
app.use(express.urlencoded({ extended: true }));
// HTML & CSS assetleri
app.use(express.static(path.join(__dirname, '../public')));

// Giriş yapılınca yapılacak yönlendirme işlemi
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

// /kayit-et basit form kayıt uygulaması
app.get('/kayit-et', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/kayitFormu.html'));
});


// Mysql Bağlantısı mysql2 kullandım. Derste onu kullandığımız için kullandım.
var dbConnect;
var dbHost = "127.0.0.1";
var dbUser= "root";
var dbPassword = "";
var dbDatabase= "servis";
mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    charset: 'utf8mb4',
    dateStrings: true}).then( async (connection) => {
        
        dbConnect = connection;
        // Veri tabanı bağlantısı gerçekleştirildiği durumda yapılacak işler  
        // Yeni bir üye oluşturacak servisi yazınız. Üye adı, parola ve e-posta bilgileri POST yöntemi ile gönderilecek.
        // Kayıt başarılı ise kayıt başarılı şeklinde JSON formatında dönüş olacak. Parola bilgisi SHA1 olarak saklanacak.
    
        app.post('/kayit', async (req, res) => {
          const { uye_adi, eposta, parola } = req.body;
        
          
          // Parola şifreleme işlemi
          const sifreliParola = crypto.createHash('sha1').update(parola).digest('hex');
        
          // Veritabanına yeni kullanıcıları ekleme işlemi
          const [sonuc] = await dbConnect.query('INSERT INTO uyeler (uye_adi, eposta, parola, tarih, saat) VALUES (?, ?, ?, CURDATE(), CURTIME())', [uye_adi, eposta, sifreliParola]);
        
          if (sonuc.affectedRows === 1) {
            return res.json({ message: 'Kayıt Başarılı!' });
          } else {
            return res.json({ message: 'Kayıt gerçekleştirilemedi.' });
          }
        });
    // Yeni bir paylaşım oluşturma
    app.post('/paylasim', async (req, res) => {
    const { uye_id, icerik } = req.body;

    // Üye mevcut mu kontrol edilir
    const [existingUser] = await dbConnect.query('SELECT * FROM uyeler WHERE uye_id = ?', [uye_id]);
    if (!existingUser) {
      return res.status(400).json({ message: 'Geçersiz üye ID' });
    }

    // Yeni paylaşım veritabanına eklenir
    const [sonuc] = await dbConnect.query('INSERT INTO paylasimlar (uye_id, icerik, tarih, saat) VALUES (?, ?, CURDATE(), CURTIME())', [uye_id, icerik]);

    if (sonuc.affectedRows === 1) {
      return res.json({ message: 'Paylaşım başarılı' });
    } else {
      return res.status(500).json({ message: 'Paylaşım başarısız oldu' });
    }
  });

  // Paylaşım silme servisi
    app.delete('/paylasim-sil/:paylasim_id', async (req, res) => {
      const { paylasim_id } = req.params;

      // Paylaşım mevcut mu kontrol edilir
      const [existingPost] = await dbConnect.query('SELECT * FROM paylasimlar WHERE paylasim_id = ?', [paylasim_id]);
      if (!existingPost) {
        return res.status(400).json({ message: 'Geçersiz paylaşım ID' });
      }

      // Paylaşım veritabanından silinir
      const [sonuc] = await dbConnect.query('DELETE FROM paylasimlar WHERE paylasim_id = ?', [paylasim_id]);

      if (sonuc.affectedRows === 1) {
        return res.json({ message: 'Paylaşım başarıyla silindi' });
      } else {
        return res.status(500).json({ message: 'Paylaşım silinemedi' });
      }
});

  // Paylaşım güncelleme servisi
  app.put('/paylasim/:paylasim_id', async (req, res) => {
    try {
      const paylasimId = req.params.paylasim_id;
      const yeniIcerik = req.body.icerik;
      
      // Paylaşımın var olup olmadığını kontrol etme
      const [rows] = await dbConnect.execute('SELECT * FROM paylasimlar WHERE paylasim_id = ?', [paylasimId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Paylaşım bulunamadı.' });
      }
  
      // Daha önce düzenlenmiş mi kontrol etme
      const [dunyaRows] = await dbConnect.execute('SELECT * FROM paylasimlar WHERE paylasim_id = ? AND duzenlendi = true', [paylasimId]);
      if (dunyaRows.length > 0) {
        return res.status(400).json({ error: 'Bu paylaşım daha önce düzenlendiği için tekrar düzenlenemez.' });
      }
  
      // Paylaşımı güncelleme
      await dbConnect.execute('UPDATE paylasimlar SET icerik = ?, duzenlendi = true WHERE paylasim_id = ?', [yeniIcerik, paylasimId]);
      return res.json({ message: 'Paylaşım güncellendi.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Sunucu hatası.' });
    }
  });

  // Takip etme / takibi bırakma işlemi (tek serviste)
  app.post('/takip-et/:takip_edilen_id', async (req, res) => {
  const { uye_id } = req.body;
  const { takip_edilen_id } = req.params;

  // Takip edilen üye mevcut mu kontrol edilir
  const [existingUser] = await dbConnect.query('SELECT * FROM uyeler WHERE uye_id = ?', [takip_edilen_id]);
  if (!existingUser) {
    return res.status(400).json({ message: 'Geçersiz takip edilen üye ID' });
  }

  // Üye kendini takip edemez
  if (takip_edilen_id === uye_id) {
    return res.status(400).json({ message: 'Kendini takip edemezsiniz' });
  }

  // Takip edildiğinde veya takipten çıkıldığında işleme uygun SQL sorgusu
  const isFollowing = await dbConnect.query('SELECT * FROM takip_edilenler WHERE takip_eden_id = ? AND takip_edilen_id = ?', [uye_id, takip_edilen_id]);
  let message = '';
  let sql = '';
  if (isFollowing[0].length === 0) {
    sql = 'INSERT INTO takip_edilenler (takip_eden_id, takip_edilen_id) VALUES (?, ?)';
    message = 'Takip işlemi başarıyla gerçekleştirildi';
  } else {
    sql = 'DELETE FROM takip_edilenler WHERE takip_eden_id = ? AND takip_edilen_id = ?';
    message = 'Takip bırakma işlemi başarıyla gerçekleştirildi';
  }

  // Takip edilen veya takibi bırakılan üyenin durumu güncellenir
  const [sonuc] = await dbConnect.query(sql, [uye_id, takip_edilen_id]);

  if (sonuc.affectedRows === 1) {
    return res.json({ message });
  } else {
    return res.status(500).json({ message: 'İşlem gerçekleştirilemedi' });
  }
});

  // Engelleme işlemi servisi
  app.post('/engelle', async (req, res) => {
  const takip_eden_id = req.body.takip_eden_id;
  const engellenen_id = req.body.engellenen_id;

  try {
    const [rows, fields] = await dbConnect.query('INSERT INTO engellenen_kisiler (uye_id, engellenen_uye_id) VALUES (?,?)', [takip_eden_id, engellenen_id]);
    res.status(200).json({ message: "Engelleme başarılı." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Engelleme işlemi başarısız." });
  }
});

  // Engel kaldırma servisi
  app.post('/engeliKaldir', async (req, res) => {
  const takip_eden_id = req.body.takip_eden_id;
  const engellenen_id = req.body.engellenen_id;

  try {
    const [rows, fields] = await dbConnect.query('DELETE FROM engellenen_kisiler WHERE uye_id=? AND engellenen_uye_id=?', [takip_eden_id, engellenen_id]);
    res.status(200).json({ message: "Engel kaldırma işlemi başarılı." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Engel kaldırma işlemi başarısız." });
  }
}); 
  // Tüm üyelerin bilgilerini çektiğiniz servis
  app.get('/uyeler', async (req, res) => {
  try {
    const [rows] = await dbConnect.execute('SELECT * FROM uyeler');
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});


  // E-posta bilgilerini güncellemek istediğiniz servis
  app.put('/uyeler/:uye_id', async (req, res) => {
  try {
    const { uye_id } = req.params;
    const { eposta } = req.body;

    const [rows] = await dbConnect.execute('UPDATE uyeler SET eposta = ? WHERE uye_id = ?', [eposta, uye_id]);
    if (rows.affectedRows === 0) {
      res.status(404).json({ message: "Üye bulunamadı." });
    } else {
      res.json({ message: "E-posta başarıyla güncellendi." });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  }); 
    
    });

    

    // Uygulamanın 2023 portunda çalışacağını söylüyoruz
app.listen(2023, function (err) {
    if (err) {
      throw err
    }
    console.log('Uygulama 2023 portunda başarıyla çalıştırıldı')
  })
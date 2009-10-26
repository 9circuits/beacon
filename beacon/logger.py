
# Beacon Logger
# Setup logging globally (ie root logger)
import types
import logging
import logging.handlers
from beacon import settings

INFO_NO_NEWLINE = logging.INFO + 1

class MultipleFormatHandler(logging.StreamHandler):

    formatters = {  logging.INFO: logging.Formatter(">>> %(message)s\n"),
                    INFO_NO_NEWLINE: logging.Formatter(">>> %(message)s"),
                    logging.DEBUG: logging.Formatter("%(filename)s:%(lineno)d - %(levelname)s - %(message)s\n"),
                    logging.WARN: logging.Formatter("%(filename)s:%(lineno)d - %(levelname)s - %(message)s\n"),
                    logging.CRITICAL: logging.Formatter("%(filename)s:%(lineno)d - %(levelname)s - %(message)s\n"),
                    logging.ERROR: logging.Formatter("%(filename)s:%(lineno)d - %(levelname)s - %(message)s\n")}

    def format(self,record):
        return self.formatters[record.levelno].format(record)

    def emit(self, record):
        try:
            msg = self.format(record)
            fs = "%s"
            if not hasattr(types, "UnicodeType"): #if no unicode support...
                self.stream.write(fs % msg)
            else:
                try:
                    self.stream.write(fs % msg)
                except UnicodeError:
                    self.stream.write(fs % msg.encode("UTF-8"))
            self.flush()
        except (KeyboardInterrupt, SystemExit):
            raise
        except:
            self.handleError(record)

LEVELS = {
    'DEBUG': logging.DEBUG,
    'INFO': logging.INFO,
    'WARNING': logging.WARN,
    'ERROR': logging.ERROR,
    'FATAL': logging.FATAL,
}

def get_logger():
    log = logging.getLogger('beacon')
    
    if settings.LOG_LEVEL:
        try:
            log.setLevel(LEVELS[settings.LOG_LEVEL.upper()])
        except Exception,e:
            print "Error setting LOG_LEVEL, available options are: \n%s" \
            % ', '.join(LEVELS.keys())
            print "Defaulting to DEBUG..." 
            log.setLevel(logging.DEBUG)
    else:
        log.setLevel(logging.DEBUG)

    if settings.LOG_TO_STDOUT:
        log.addHandler(MultipleFormatHandler())

    if settings.BEACON_LOG_FILE:
        try:
            mfh = MultipleFormatHandler(open(settings.BEACON_LOG_FILE, 'w'))
            log.addHandler(mfh)
        except Exception, e:
            print "Problem logging to BEACON_LOG_FILE:"
            print e

    if settings.LOG_TO_SYSLOG:
        syslog_handler = logging.handlers.SysLogHandler(address='/dev/log')
        formatter = logging.Formatter("%(filename)s:%(lineno)d - %(levelname)s - %(message)s\n")
        syslog_handler.setFormatter(formatter)
        log.addHandler(syslog_handler)

    if not settings.LOGGING:
        logging.disable(logging.FATAL + 1)

    return log

log = get_logger()
